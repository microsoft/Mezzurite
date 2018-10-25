import { AngularPerfTelemetryService } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-telemetry.service';
import { PerformanceTimingService } from '@des.epic.uscp.scripts/mezzurite.core/performance-timing.service';
import { AngularPerfComponent } from '@des.epic.uscp.scripts/mezzurite.angular2/angular-performance-component';
import { TestBed } from '@angular/core/testing';

describe('AngularPerfTelemetryService', () => {
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

  it('should be able to create service instance', () => {
    expect(telemetryService).toBeDefined();
  });

  it('should capture statistics for instrumented components in component list', () => {
    telemetryService.addComponent('component1', null);
    expect(telemetryService.essentialComponentTrackers[0].componentList.length).toBe(1);
    expect(telemetryService.essentialComponentTrackers[0].componentList[0].startTime).toBeDefined();
    telemetryService.setComponentComplete('component1');
    expect(telemetryService.essentialComponentTrackers[0].componentList.length).toBe(1);
    expect(telemetryService.essentialComponentTrackers[0].componentList[0].endTime).toBeDefined();
    telemetryService.removeComponent('component1');
    expect(telemetryService.essentialComponentTrackers[0].componentList.length).toBe(0);
  });

  it('should capture statistics for instrumented components in timing collection', () => {
    telemetryService.createTiming('#routeStart');
    expect(telemetryService.timingCollection.componentList.length).toBe(1);
    expect(telemetryService.timingCollection.componentList[0].startTime).toBeDefined();

    const s = telemetryService.getComponentStartTime('#routeStart');
    expect(telemetryService.timingCollection.componentList[0].startTime).toBe(s);
  });
});
