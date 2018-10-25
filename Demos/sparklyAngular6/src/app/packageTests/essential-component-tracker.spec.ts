import { AngularPerfTelemetryService } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-telemetry.service';
import { PerformanceTimingService } from '@des.epic.uscp.scripts/mezzurite.core/performance-timing.service';
import { AngularPerfComponent } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-component';
import { TestBed } from '@angular/core/testing';

describe('EssentialComponentTracker', () => {
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

    it('should have instance of component tracker', () => {
        expect(telemetryService.essentialComponentTrackers).toBeDefined();
    });

    it('should be able to add and restart perf components', () => {
        const startTime = new Date().getTime();
        const angularComponent: AngularPerfComponent = new AngularPerfComponent('component1', null);
        telemetryService.essentialComponentTrackers[0].add('component1', angularComponent);
        let endTime = new Date().getTime();

        expect(telemetryService.essentialComponentTrackers[0].componentList[0].startTime).toBeGreaterThanOrEqual(startTime);
        expect(telemetryService.essentialComponentTrackers[0].componentList[0].startTime).toBeLessThanOrEqual(endTime);

        // time has been updated, expect the API to do the same
        endTime = new Date().getTime();
        telemetryService.essentialComponentTrackers[0].addOrRestart('component1', null);
        expect(telemetryService.essentialComponentTrackers[0].componentList[0].startTime).toBeGreaterThanOrEqual(endTime);

        // time has been updated, expect the API to do the same
        endTime = new Date().getTime();
        telemetryService.essentialComponentTrackers[0].updateStartTime(angularComponent);
        expect(telemetryService.essentialComponentTrackers[0].componentList[0].startTime).toBeGreaterThanOrEqual(endTime);
    });
});
