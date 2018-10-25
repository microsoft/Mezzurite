import { AngularPerfTelemetryService } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-telemetry.service';
import { PerformanceTimingService } from '@des.epic.uscp.scripts/mezzurite.core/performance-timing.service';
import { AngularPerfComponent } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-component';
import { instrument } from '@des.epic.uscp.scripts/mezzurite.core';
import { TestBed } from '@angular/core/testing';
import { Observable, TimeInterval } from 'rxjs';
import 'rxjs/add/operator/takeWhile';
import { takeWhile } from 'rxjs/operators';

describe('Operator.Instrument', () => {
  let telemetryService: AngularPerfTelemetryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            AngularPerfTelemetryService,
            PerformanceTimingService,
        ]
    });

    telemetryService = TestBed.get(AngularPerfTelemetryService);
  });

    it('should invoke on predicate returning true and observable complete', () => {
        const startTime = new Date().getTime();
        const compName = 'component1';
        const angularComponent: AngularPerfComponent = new AngularPerfComponent(compName, null);

        spyOn(telemetryService, 'setComponentComplete').and.callThrough();
        telemetryService.essentialComponentTrackers[0].add(compName, angularComponent);

        let fakeComponent = {
            componentName: compName,
            telemetry : telemetryService
        };

        Observable
        .from([15,25,35,45,55,65])
        .let(instrument(fakeComponent, v => {
          if (v === 55) {
            return true;
          }
    
          return false;
        }))
        .takeWhile(function (x) {
          return x < 45;
        })
        .subscribe();

        // once for the evaluated condition, once for the complete condition
        expect(telemetryService.setComponentComplete).toHaveBeenCalledTimes(2);
        expect(telemetryService.essentialComponentTrackers[0].componentList[0].endTime).toBeGreaterThan(startTime);
    });

    it('should only invoke on observable complete, without predicate returning true', () => {
        const startTime = new Date().getTime();
        const compName = 'component1';
        const angularComponent: AngularPerfComponent = new AngularPerfComponent(compName, null);

        spyOn(telemetryService, 'setComponentComplete').and.callThrough();
        telemetryService.essentialComponentTrackers[0].add(compName, angularComponent);

        let fakeComponent = {
            componentName: compName,
            telemetry : telemetryService
        };

        Observable
        .from([15,25,35,45,55,65])
        .let(instrument(fakeComponent, v => {
          // method has no true condition    
          return false;
        }))
        .takeWhile(function (x) {
          return x < 45;
        })
        .subscribe();

        // once for the complete condition
        expect(telemetryService.setComponentComplete).toHaveBeenCalledTimes(1);
    });

    it('should only invoke on complete, if predicate missing', () => {
        const startTime = new Date().getTime();
        const compName = 'component1';
        const angularComponent: AngularPerfComponent = new AngularPerfComponent(compName, null);

        spyOn(telemetryService, 'setComponentComplete').and.callThrough();
        telemetryService.essentialComponentTrackers[0].add(compName, angularComponent);

        let fakeComponent = {
            componentName: compName,
            telemetry : telemetryService
        };

        Observable
        .from([15,25,35,45,55,65])
        .let(instrument(fakeComponent))
        .takeWhile(function (x) {
          return x < 45;
        })
        .subscribe();

        // once for the complete condition
        expect(telemetryService.setComponentComplete).toHaveBeenCalledTimes(1);
    });

    it('should not crash if predicate throws an exception', () => {
        const startTime = new Date().getTime();
        const compName = 'component1';
        const angularComponent: AngularPerfComponent = new AngularPerfComponent(compName, null);
        let afterExceptionCounter = 0;

        spyOn(telemetryService, 'setComponentComplete').and.callThrough();
        telemetryService.essentialComponentTrackers[0].add(compName, angularComponent);

        let fakeComponent = {
            componentName: compName,
            telemetry : telemetryService
        };

        Observable
        .from([15,25,35,45,55,65])
        .let(instrument(fakeComponent, v => {
            // exception being thrown in predicate
            throw -10;
        }))
        .filter((v, i) => {
            // ensure that the observable chain isn't broken after exception is thrown
            afterExceptionCounter++;
            return true;
        })
        .subscribe();

        // once for the complete condition
        expect(telemetryService.setComponentComplete).toHaveBeenCalledTimes(1);

        // exception should not break observer chain
        expect(afterExceptionCounter).toBe(6);
    });

    var timeoutWait = 3000;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutWait;

    it('should handle observable which does not fire complete event', (done) => {
        const startTime = new Date().getTime();
        const compName = 'component1';
        const angularComponent: AngularPerfComponent = new AngularPerfComponent(compName, null);

        spyOn(telemetryService, 'setComponentComplete').and.callThrough();
        telemetryService.essentialComponentTrackers[0].add(compName, angularComponent);

        let fakeComponent = {
            componentName: compName,
            telemetry : telemetryService
        };

        Observable
        .interval(100)
        .timeInterval()
        .let(instrument(fakeComponent, (v: TimeInterval<number>) => {
            // update on the 10th iteration
            if (v.value === 10) {
                return true;
            }
            return false;
        }))
        .subscribe();

        setTimeout(() => {
            // once for the true predicate condition
            expect(telemetryService.setComponentComplete).toHaveBeenCalledTimes(1);
            done();
        }, 2000);
    });
})