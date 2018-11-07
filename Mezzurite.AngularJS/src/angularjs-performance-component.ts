// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants, PerformanceTimingService } from '@microsoft/mezzurite-core';
import { MezzuriteAngularJsUtils } from './angularjs-performance-utils.service';

export class AngularJsPerfComponent {
    fullName: string;
    key: string;
    constructor(public name: string, public element: HTMLElement) {
        this.key = MezzuriteAngularJsUtils.makeId();
        window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);
        this.fullName = MezzuriteConstants.measureNamePrefix + ";" + this.name + ";" + this.key
        const config = {
            root: null, // setting it to 'null' sets it to default value: viewport
            rootMargin: '0px'
        };
        var that = this;
        let observer = new IntersectionObserver(function(entries) {
            const entry = entries[0];
            if (that.fullName !== undefined){
                if (entry.isIntersecting){
                    (<any>window).mezzurite.viewportWidth = entry.rootBounds.width;
                    (<any>window).mezzurite.viewportHeight = entry.rootBounds.height;
                    (<any>window).mezzurite.vltComponentLookup[that.fullName] = true;
                }
                else{
                    (<any>window).mezzurite.vltComponentLookup[that.fullName] = false;
                }
            }
        }, config);
            observer.observe(this.element);
    }

    setComponentComplete(){
        window.performance.mark(this.key + MezzuriteConstants.componentMarkEnd);
        var that = this;
        setTimeout(function(){
            const slow = PerformanceTimingService.calculateSlowestResource(that.element, that.fullName);
            if (slow === null){
                PerformanceTimingService.measure(that.fullName)
            }
            else{
                PerformanceTimingService.measure(that.fullName, slow)
            }
        },MezzuriteConstants.slowestResourceTimeout)
    }
}
