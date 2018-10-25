// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from './performance-constants';
import { MezzuriteUtils } from './performance-utils.service';

export class PerformanceTimingService {
    static measure(name: string, slowestResource: any = null, maxComponentEndTime: any = null): void{
        let startEntry;
        let endEntry;
        const componentTitle = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartTitle);
        const key = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartKey);
        if (name === undefined){
            return null;
        }
    
        if (componentTitle === MezzuriteConstants.altName){
            // ALT
            endEntry = performance.getEntriesByName(MezzuriteConstants.altMarkEnd)[0];
        }
        else if (componentTitle === MezzuriteConstants.vltName){
            // VLT
            startEntry = performance.getEntriesByName(MezzuriteConstants.vltMarkStart)[0];
            endEntry = {
                startTime: maxComponentEndTime
            };
        }
        else{
            // Component
            startEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkStart)[0];
            endEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkEnd)[0];
        }
    
        // start time inside render hook
        const renderStartEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkRenderStart)[0];
    
        const startTime = startEntry !== undefined ? startEntry.startTime : 0;
        let endTime = endEntry.startTime;
    
        // reset end time to end of slowest resource if 
        if (slowestResource !== null && slowestResource.responseEnd > endTime){
            endTime = slowestResource.responseEnd;
        }
    
        const mountDuration = endEntry.startTime - startTime;
        const totalDuration = endTime - startTime
    
        let obj = {
            name: name,
            startTime: startTime,
            endTime: endTime,
            timeToMount: mountDuration,
            componentLoadTime: totalDuration
        }
    
        if (slowestResource && slowestResource.responseEnd >= startTime){
            (<any>obj)["slowestResourceEnd"] = slowestResource.responseEnd;
        }
        else if (slowestResource !== null) {
            (<any>obj)["slowestResourceEnd"] = -1;
        }
    
        if (componentTitle !== MezzuriteConstants.altName && componentTitle !== MezzuriteConstants.vltName && renderStartEntry){
            (<any>obj)["renderStartTime"] = renderStartEntry.startTime;
        }
    
        (<any>window).mezzurite.measures.push(obj);
    }

    static getMeasureByName(name: string){
        if (name === undefined || name === null){
            return null;
        }
        const measures = (<any>window).mezzurite.measures;
        for (let i = 0; i < measures.length; i++){
            if (name === measures[i].name){
                return measures[i];
            }
        }
        return null;
    }

    static getCurrentComponents(){
        const components = (<any>window).mezzurite.measures.filter((m:any) => 
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
            m.startTime >= (<any>window).mezzurite.startTime &&
            m.startTime <= (<any>window).mezzurite.endTime
        )
        return components;
    }

    static getCurrentComponentsLookup(){
        const components = (<any>window).mezzurite.measures.filter((m:any) => 
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
            m.startTime >= (<any>window).mezzurite.startTime &&
            m.startTime <= (<any>window).mezzurite.endTime
        )
        let obj = {};
        for (let i = 0; i < components.length; i++){
            var name: string = components[i].name
            (<any>obj)[name] = components[i];
        }
        return obj;
    }

    static calculateVlt(){
        let maxComponent = null;
        let maxEndTime = 0;
        let vltComponents: any[] = [];
        const components: any = this.getCurrentComponentsLookup();
        let vltLookup = (<any>window).mezzurite.vltComponentLookup;
        let measure;
        for (let key in vltLookup){
            if (vltLookup[key] === true){
                vltComponents.push(components[key]);
                if (maxComponent !== null){
                    let slowestResourceEnd = 0;
                    const slowestResource = (<any>window).mezzurite.slowestResource[key];
                    if (slowestResource !== undefined && slowestResource !== null){
                        slowestResourceEnd = slowestResource.responseEnd;
                    }
                    var maxLast = maxComponent.componentLoadTime + maxComponent.startTime;
                    var currLast = components[key].componentLoadTime + components[key].startTime;
                    if (currLast > maxLast){
                        maxComponent = components[key];
                        maxEndTime = currLast;
                    }
                }
                else {
                    maxComponent = components[key];
                }
            }
        }
        if (maxComponent !== null){
            const key = MezzuriteUtils.getFullNamePart(maxComponent.name, MezzuriteConstants.fullNamePartKey);
            const vltName = MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName + ";" + key;
            this.measure(vltName, null, maxComponent.endTime);
            measure = this.getMeasureByName(vltName);
            performance.clearMarks(MezzuriteConstants.vltMarkStart);
        }
        else {
            return null;
            // no components in view
        }
        return {
            vlt: measure.componentLoadTime,
            components: vltComponents
        }
        }

        static getElNames(el: any, key: string){
            if ((<any>window).mezzurite.childElementNames[key] === undefined){
                (<any>window).mezzurite.childElementNames[key] = [];
            }
            if (el.tagName === 'IMG'){
                (<any>window).mezzurite.childElementNames[key].push(el.src);
            }
        }

        static calculateSlowestResource(el: any, fullName: string){
            const key = MezzuriteUtils.getFullNamePart(fullName, MezzuriteConstants.fullNamePartKey);
            let slowestResource = null;
            MezzuriteUtils.walkDOM(el, key, this.getElNames);
        
            const resources: any = performance.getEntriesByType("resource").filter((r:any) => (<any>r).initiatorType === 'img');
            const currentResources = (<any>window).mezzurite.childElementNames[key];
            if (resources.length === 0){
                return;
            }
            for (let i = 0; i < currentResources.length; i++){
                for (let j = 0; j < resources.length; j++){
                    if (currentResources[i] === resources[j].name && (slowestResource === null || resources[j].responseEnd > slowestResource.responseEnd)){
                        slowestResource = resources[j];
                    }
                }
            }
            (<any>window).mezzurite.slowestResource[fullName] = slowestResource;
            return slowestResource;
        }   
}