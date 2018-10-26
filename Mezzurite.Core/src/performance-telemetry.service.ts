// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from './performance-constants';
import { PerformanceTimingService } from './performance-timing.service';
import { MezzuriteUtils } from './performance-utils.service';


export class PerformanceTelemetryService {

    static startCaptureCycle(){  
        let that = this;
        if (!(<any>window).mezzurite.captureCycleStarted){
            (<any>window).mezzurite.startTime = window.performance.now();
            (<any>window).mezzurite.captureCycleStarted = true;
            (<any>window).mezzurite.captureTimer = setTimeout(function(){
                that.captureTimings();
            },MezzuriteConstants.captureCycleTimeout)
        }
    };

    static captureTimings(isRedirect = false){
        clearTimeout((<any>window).mezzurite.captureTimer);
        (<any>window).mezzurite.endTime = window.performance.now();
        if (!(<any>window).mezzurite.captureCycleStarted){
            (<any>window).mezzurite.captureCycleStarted = true;
        }
        const components = (<any>window).mezzurite.measures.filter((m:any) => 
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
            m.startTime >= (<any>window).mezzurite.startTime &&
            m.startTime <= (<any>window).mezzurite.endTime
        )
        if (components.length > 0){
            this.submitTelemetry(isRedirect)
        }
        (<any>window).mezzurite.captureCycleStarted = false;
    };

    static submitTelemetry(isRedirect: boolean): void {
        let timings: any[] = [];
        // add redirect value
        timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.redirect, isRedirect === false ? 0 : 1))
    
        // all components
        var components = PerformanceTimingService.getCurrentComponents();
        if ((<any>window).mezzurite.routerPerf){
            // alt
            if ((<any>window).mezzurite.firstViewLoaded === false){
                const altMeasure = (<any>window).mezzurite.measures.filter((m:any) => m.name.indexOf(MezzuriteConstants.altName) > -1)[0];
                timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.altName, altMeasure.componentLoadTime));
                (<any>window).mezzurite.firstViewLoaded = true;
            }
            // vlt
            const vltResults = PerformanceTimingService.calculateVlt();
            if (vltResults.components.length > 0){
                timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.vltName, vltResults.vlt, vltResults.components));
            }
        }
        timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.allComponents, -1, components));
        this.log(timings);
        MezzuriteUtils.testReset();
    };

    static compatibilityCheck(){
        const isCompatible = (window.performance !== undefined);
        if (!isCompatible){
               const timings = [MezzuriteUtils.createMetric(MezzuriteConstants.unsupportedBrowserName, -1, MezzuriteConstants.unsupportedBrowserPerf)]
            this.log(timings);
        }
        return isCompatible;
    }

    static log(timings: any){
        if ((<any>window).mezzurite){
            if (timings.length > 1){
                const obj = {
                    Timings: timings,
                    Framework: {
                        name: (<any>window).mezzurite.packageName,
                        version: (<any>window).mezzurite.packageVersion
                    },
                    ViewportWidth: (<any>window).mezzurite.viewportWidth,
                    ViewportHeight: (<any>window).mezzurite.viewportHeight
                }
                if ((<any>window).mezzurite.EventElement)
                {
                    (<any>window).mezzurite.EventElement.dispatchEvent(new CustomEvent('Timing', {detail: obj}));
                }
                else{
                    (<any>obj)["DateTime"] = Date.now();
                    (<any>window).mezzurite.defaultLogs.push(obj);
                }
            }
            else {
                console.log("no logs in default");
            }
        }
    };
}