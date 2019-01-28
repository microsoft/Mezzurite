// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { PerformanceTimingService, PerformanceTelemetryService, MezzuriteConstants } from '@microsoft/mezzurite-core';
import { MezzuriteAngularUtils } from './angular-performance-utils.service';

/**
 * RoutingService is responsible for listening to the routing events coming
 * into the application and creating performance marks based on them.
 */
@Injectable()
export class RoutingService {
  endCounter = 0;

  constructor (private router: Router) {
    if (!(window as any).mezzurite) {
      (window as any).mezzurite = {};
    }
    MezzuriteAngularUtils.createMezzuriteObject((window as any).mezzurite);
    (window as any).mezzurite.routerPerf = true;
  }

    /**
     * this method begins the listening process. Must be called for code to function properly.
     */
  start (): void {
    const onNavStart$ = this.router.events.pipe(filter(event => event instanceof NavigationStart));

    onNavStart$.subscribe((e: any) => {
      this.handleRoute(e);
    });
  }

  handleRoute (e: any) {
    (window as any).mezzurite.routeUrl = e.url;
    if ((window as any).mezzurite.captureCycleStarted) {

      (window as any).mezzurite.captureCycleStarted = false;
      PerformanceTelemetryService.captureTimings(true);
      window.performance.mark(MezzuriteConstants.vltMarkStart);
            // starts a new capture cycle
      PerformanceTelemetryService.startCaptureCycle();
    } else {
            // starts the capture cycle to transmit telemetry if current pathname is different than recentPath
      PerformanceTelemetryService.startCaptureCycle();
            // If first load, capture ALT
      if (!(window as any).mezzurite.firstViewLoaded) {
        window.performance.mark(MezzuriteConstants.altMarkEnd);
        window.performance.mark(MezzuriteConstants.vltMarkStart);
        const fullName = MezzuriteAngularUtils.getName(MezzuriteConstants.altName, MezzuriteAngularUtils.makeId());
        PerformanceTimingService.measure(fullName, 0, MezzuriteConstants.altMarkEnd);
      } else {
        window.performance.mark(MezzuriteConstants.vltMarkStart);
      }
    }
  }
}
