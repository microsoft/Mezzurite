import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { RoutingService, AngularPerfModule, AngularPerfTelemetryService } from '@des.epic.uscp.scripts/mezzurite.angular2';
import { PerformanceTimingService } from '@des.epic.uscp.scripts/mezzurite.core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InterestingComponentComponent } from '../interesting-component/interesting-component.component';
import { AppComponent } from '../../app/app.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: InterestingComponentComponent},
];

declare var awa: any;

describe('RoutingService', () => {
  let mezzuriteRoutingService: RoutingService;
  let angularTestRouter: Router;
  let location: Location;
  let telemetryService: AngularPerfTelemetryService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes), 
        AngularPerfModule.forRoot()],
      declarations: [
        AppComponent,
        InterestingComponentComponent],
    });

    mezzuriteRoutingService = TestBed.get(RoutingService);
    location = TestBed.get(Location);
    telemetryService = TestBed.get(AngularPerfTelemetryService);
    angularTestRouter = TestBed.get(Router);
    mezzuriteRoutingService.start();

    const config = {
      autoCapture: {
          pageView: true,
          onLoad: false,
          click: true,
          scroll: true,
          resize: true,
          context: true,
          jsError: true,
          addin: true,
          perf: true,
          assets: true
      },
      coreData: {
          appId: 'test'
      },
      consoleVerbosity: 1
    };

    awa.init(config);
    awa.cv.init();
  });

  it('should be able to create service instance', () => {
    expect(mezzuriteRoutingService).toBeDefined();
  });

  it('should be listening to routing events', () => {
     spyOn(telemetryService, 'createTiming');
     angularTestRouter.navigateByUrl('/home');
     expect(telemetryService.createTiming).toHaveBeenCalled();
  });

  var flag;
  var timeoutWait = 15000;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutWait;

  it('should be firing application load time events', (done) => {
    spyOn(telemetryService, 'getApplicationLoadTime').and.callFake(() => { return { metricType: "Application Load Time", value: 900, data: {} }; });
    angularTestRouter.navigateByUrl('/home');

    // Sleep for ten seconds prior to checking the application load time.
    setTimeout(() => {
        expect(telemetryService.getApplicationLoadTime).toHaveBeenCalledTimes(1);
        var alt = telemetryService.getApplicationLoadTime();
        expect(alt.value).toBe(900);
        done();
    }, 11000);
  });

  it('should be firing viewport load time events', (done) => {
    spyOn(telemetryService, 'getViewportLoadTime');
    angularTestRouter.navigateByUrl('/home');
    
        // Sleep for ten seconds prior to checking the application load time.
        setTimeout(() => {
            expect(telemetryService.getViewportLoadTime).toHaveBeenCalledTimes(1);
            done();
        }, 11000);
  })
});
