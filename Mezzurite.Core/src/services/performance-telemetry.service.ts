// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from '../utils/performance-constants';
import { PerformanceTimingService } from './performance-timing.service';
import { MezzuriteUtils } from './performance-utils.service';

/**
 * Class containing core telemetry functions
 */
export class PerformanceTelemetryService {
    /**
     * Starts capture cycle period
     */
  static startCaptureCycle () {
    if (!(window as any).mezzurite.captureCycleStarted) {
      (window as any).mezzurite.startTime = window.performance.now();
      (window as any).mezzurite.captureCycleStarted = true;
      (window as any).mezzurite.captureTimer = setTimeout(function () {
        PerformanceTelemetryService.captureTimings();
      }, MezzuriteConstants.captureCycleTimeout);
    }
  }

    /**
     * Captures timings for the given period
     * @param isRedirect Bool dictating whether timings were captured at end of cycle or early
     */
  static captureTimings (isRedirect = false) {
    clearTimeout((window as any).mezzurite.captureTimer);
    (window as any).mezzurite.endTime = window.performance.now();
    if (!(window as any).mezzurite.captureCycleStarted) {
      (window as any).mezzurite.captureCycleStarted = true;
    }
    PerformanceTelemetryService.submitTelemetry(isRedirect);
    (window as any).mezzurite.captureCycleStarted = false;
  }

    /**
     * Creates timings object to send to telemetry
     * @param isRedirect isRedirect bool
     */
  static submitTelemetry (isRedirect: boolean): void {
    const timings: any[] = [];
        // add redirect value
    timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.redirect, isRedirect === false ? 0 : 1));

        // calculate component measures off slowest resource values
    if ((window as any).mezzurite.elementLookup !== {}) {
      PerformanceTimingService.calculateSlowestResourceBatch();
    }
        // all components
    const components = PerformanceTimingService.getCurrentComponents();
    if ((window as any).mezzurite.routerPerf) {
      var vltResults ={} as any;

            // vlt
     if (components.length > 0) {
        vltResults = PerformanceTimingService.calculateVlt();
        if (vltResults !== null) {
              timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.vltName, vltResults.vlt , vltResults.components));
          }
       }
      // alt
      if ((window as any).mezzurite.firstViewLoaded === false) {
        const altMeasure = (window as any).mezzurite.measures.filter((m: any) => m.name.indexOf(MezzuriteConstants.altName) > -1)[0];
        timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.altName, altMeasure.clt));
        if (vltResults !== null) {
          timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.fvltName, vltResults.vlt + altMeasure.clt));
        }
        (window as any).mezzurite.firstViewLoaded = true;
      }

      if (components.length === 0) {
        performance.clearMarks(MezzuriteConstants.vltMarkStart);
      }
    }
    if (components.length > 0) {
      timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.allComponents, -1, components));
    }
    this.log(timings);
    MezzuriteUtils.testReset();
  }

    /**
     * Adds remaining metadata to send to logger and dispatches event
     * @param timings
     */
  static log (timings: any) {
    if ((window as any).mezzurite) {
      if (timings.length > 1) {
        const obj = {
          Timings: timings,
          Framework: {
            name: (window as any).mezzurite.packageName,
            version: (window as any).mezzurite.packageVersion
          },
          ViewportWidth: (window as any).mezzurite.viewportWidth,
          ViewportHeight: (window as any).mezzurite.viewportHeight,
          ObjectVersion: MezzuriteConstants.mezzuriteObjectVersion,
          RouteUrl: (window as any).mezzurite.routeUrl
        };
                // log to console when developing locally
        if ((window as any).location.href.indexOf('localhost') > -1) {
          console.log('to log for testing: ', obj);
        }
        if ((window as any).mezzurite.EventElement) {
          (window as any).mezzurite.EventElement.dispatchEvent(new CustomEvent('Timing', { detail: obj }));
        }
      } else {
        console.log('nothing for Mezzurite to log.');
      }
    }
  }

    /**
     * Checks whether window.performance is undefined
     */
  static compatibilityCheck () {
    const isCompatible = (window.performance !== undefined);
    if (!isCompatible) {
      const timings = [
        MezzuriteUtils.createMetric(MezzuriteConstants.unsupportedBrowserName,
                   -1,
                   MezzuriteConstants.unsupportedBrowserPerf)
      ];
      this.log(timings);
    }
    return isCompatible;
  }
}
