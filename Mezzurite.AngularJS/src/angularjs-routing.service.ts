// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {MezzuriteConstants, PerformanceTelemetryService, PerformanceTimingService} from "@microsoft/mezzurite-core";
import { MezzuriteAngularJsUtils } from './angularjs-performance-utils.service';

export class AngularJsRoutingService {
    firstLoad: Boolean = true;
    endCounter: number = 0;
    cancelPromise: ng.IPromise<void>;

    public static $inject = ["$timeout"];

    constructor(
        private $timeout: ng.ITimeoutService) {
    }

    public start(scope: any, transitions?: any): void {
        if (!(<any>window).mezzurite){
            (<any>window).mezzurite = {};
        }
        MezzuriteAngularJsUtils.createMezzuriteObject((<any>window).mezzurite);
        (<any>window).mezzurite.routerPerf = true;
        // if using ngRoute module
        scope.$on("$routeChangeStart", (e: any, next: any, current: any) => {
            // console.log("route change start fired");
            /* If there is no route determined yet, often used in ".otherwise" scenarios
            * we will wait until the route has been determined to begin calculations.
            */

            if (!next || !next.$$route) {
                // initial route
                return;
            }

            if ((<any>window).mezzurite.routeUrl !== next.$$route.originalPath){
                // handle re-route before complete timing capture cycle
                if ((<any>window).mezzurite.captureCycleStarted){
                    (<any>window).mezzurite.captureCycleStarted = false;
                    PerformanceTelemetryService.captureTimings(true);
                    window.performance.mark(MezzuriteConstants.vltMarkStart);
                    // starts a new capture cycle
                    PerformanceTelemetryService.startCaptureCycle();
                }
                else{
                      // starts the capture cycle to transmit telemetry if current pathname is different than routeUrl
                    PerformanceTelemetryService.startCaptureCycle();
                    // If first load, capture ALT
                    if (!(<any>window).mezzurite.firstViewLoaded){
                        (<any>window).mezzurite.startTime = 0;
                        window.performance.mark(MezzuriteConstants.altMarkEnd);
                        window.performance.mark(MezzuriteConstants.vltMarkStart);
                        PerformanceTimingService.measure(MezzuriteAngularJsUtils.getName(MezzuriteConstants.altName, MezzuriteAngularJsUtils.makeId()), 0, MezzuriteConstants.altMarkEnd);
                    }
                    else{
                        window.performance.mark(MezzuriteConstants.vltMarkStart);
                    }
                }
            }   
            (<any>window).mezzurite.routeUrl = next.$$route.originalPath;
        });

        scope.$on("$stateChangeStart", (e: any, toState: any, toParams: any, fromState: any, fromParams: any, options: any) => {
            if (!toState || !toState.url) {
                return;
            }

            if ((<any>window).mezzurite.captureCycleStarted){
                (<any>window).mezzurite.captureCycleStarted = false;
                PerformanceTelemetryService.captureTimings(true);
                window.performance.mark(MezzuriteConstants.vltMarkStart);
                // starts a new capture cycle
                PerformanceTelemetryService.startCaptureCycle();
            }
            else{
                  // starts the capture cycle to transmit telemetry if current pathname is different than recentPath
                PerformanceTelemetryService.startCaptureCycle();
                // If first load, capture ALT
                if (!(<any>window).mezzurite.firstViewLoaded){
                    window.performance.mark(MezzuriteConstants.altMarkEnd);
                    window.performance.mark(MezzuriteConstants.vltMarkStart);
                    PerformanceTimingService.measure(MezzuriteAngularJsUtils.getName(MezzuriteConstants.altName, MezzuriteAngularJsUtils.makeId()), 0, MezzuriteConstants.altMarkEnd);
                }
                else{
                    window.performance.mark(MezzuriteConstants.vltMarkStart);
                }
            }
        })

        // if using angular-ui-router
        if (transitions) {
            transitions.onStart({}, (transition: any) => {
                if ((<any>window).mezzurite.captureCycleStarted){
                    (<any>window).mezzurite.captureCycleStarted = false;
                    PerformanceTelemetryService.captureTimings(true);
                    window.performance.mark(MezzuriteConstants.vltMarkStart);
                    // starts a new capture cycle
                    PerformanceTelemetryService.startCaptureCycle();
                }
                else{
                      // starts the capture cycle to transmit telemetry if current pathname is different than recentPath
                    PerformanceTelemetryService.startCaptureCycle();
                    // If first load, capture ALT
                    if (!(<any>window).mezzurite.firstViewLoaded){
                        window.performance.mark(MezzuriteConstants.altMarkEnd);
                        window.performance.mark(MezzuriteConstants.vltMarkStart);
                        PerformanceTimingService.measure(MezzuriteAngularJsUtils.getName(MezzuriteConstants.altName, MezzuriteAngularJsUtils.makeId()), 0, MezzuriteConstants.altMarkEnd);
                    }
                    else{
                        window.performance.mark(MezzuriteConstants.vltMarkStart);
                    }
                }
            });
        }
    }
}
