// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { filter } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { PerformanceTimingService, PerformanceTelemetryService, MezzuriteConstants} from "@microsoft/mezzurite-core";
import { MezzuriteAngularUtils } from "./performance-utils-angular.service";


/**
 * RoutingService is responsible for listening to the routing events coming
 * into the application and creating performance marks based on them.
 * @export
 * @class RoutingService
 */
@Injectable()
export class RoutingService {
    endCounter: number = 0;

    constructor(private router: Router) {
            if (!(<any>window).mezzurite){
                (<any>window).mezzurite = {};
            }
            MezzuriteAngularUtils.createMezzuriteObject((<any>window).mezzurite);
            (<any>window).mezzurite.routerPerf = true;
        }

    /* this method begins the listening process. Must be called for code to function properly. */
    start = (): any => {
        const onNavStart$ = (<any>this).router.events.pipe(filter(event => event instanceof NavigationStart));

        onNavStart$.subscribe(() => {
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
                    PerformanceTimingService.measure(MezzuriteAngularUtils.getName(MezzuriteConstants.altName, MezzuriteAngularUtils.makeId()), 0, MezzuriteConstants.altMarkEnd);
                }
                else{
                    window.performance.mark(MezzuriteConstants.vltMarkStart);
                }
            }
            
        });
    };
}
