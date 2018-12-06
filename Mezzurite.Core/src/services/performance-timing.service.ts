// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from '../utils/performance-constants';
import { MezzuriteUtils } from './performance-utils.service';

/**
 * Class containing core timing functions
 */
export class PerformanceTimingService {
    /**
     * Creates measure object from given set of performance marks
     * @param name full semicolon delimited name
     * @param slowestResource Slowest resource inside component
     * @param maxComponentEndTime Max component end time (if VLT)
     */
    static measure(name: string, slowestResource: any = null, maxComponentEndTime: any = null): void{
        let startEntry;
        let endEntry;

        const componentTitle = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartTitle);
 
        const key = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartKey);
        if (name === undefined){
            return;
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
        const nameArr = name.split(';');
    
        let obj = {
            name: nameArr[1],
            id: nameArr[2],
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

    /**
     * Gets measures by name
     * @param name name
     */
    static getMeasuresByName(name: string){
        let result: any[] = [];
        if (name === undefined || name === null){
            return null;
        }
        const measures = (<any>window).mezzurite.measures;
        for (let i = 0; i < measures.length; i++){
            if (name === measures[i].name){
                result.push(measures[i]);
            }
        }
        return result;
    }

        /**
     * Gets a specific measure by id
     * @param id id
     */
    static getMeasureById(id: number){
        if (id === undefined || id === null){
            return null;
        }
        const measures = (<any>window).mezzurite.measures;
        for (let i = 0; i < measures.length; i++){
            if (id === measures[i].id){
                return measures[i];
            }
        }
        return null;
    }

            /**
     * Gets a specific measure by name and id
     * @param name name
     * @param id id
     */
    static getMeasureByNameAndId(name: string, id: number){
        if (name === undefined || name === null || id === undefined || id === null){
            return null;
        }
        const measures = (<any>window).mezzurite.measures;
        for (let i = 0; i < measures.length; i++){
            if (name === measures[i].name && id === measures[i].id){
                return measures[i];
            }
        }
        return null;
    }

    /**
     * Gets current components from a given capture cycle
     */
    static getCurrentComponents(){
        const components = (<any>window).mezzurite.measures.filter((m:any) => 
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
            m.startTime >= (<any>window).mezzurite.startTime &&
            m.startTime <= (<any>window).mezzurite.endTime
        )
        return components;
    }

    /**
     * Gets lookup object of current components
     */
    static getCurrentComponentsLookup(){
        const components = (<any>window).mezzurite.measures.filter((m:any) => 
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
            m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
            m.startTime >= (<any>window).mezzurite.startTime &&
            m.startTime <= (<any>window).mezzurite.endTime
        )
        let obj: any = {};
        for (let i = 0; i < components.length; i++){
            obj[MezzuriteConstants.measureNamePrefix + ';' + components[i].name + ';' + components[i].id] = components[i];
        }
        return obj;
    }

    /**
     * Calculates viewport load time
     */
    static calculateVlt(){
        let maxComponent = null;
        let maxEndTime = 0;
        let vltComponents: any[] = [];
        const components: any = this.getCurrentComponentsLookup();
        let vltLookup = (<any>window).mezzurite.vltComponentLookup;
        let measure;
        for (let key in vltLookup){
            if (components[key] && vltLookup[key] === true){
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
            const fullName = MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.vltName + ';' + maxComponent.id;
            this.measure(fullName, null, maxComponent.endTime);
            measure = this.getMeasureByNameAndId(MezzuriteConstants.vltName, maxComponent.id);
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

    /**
     * Creates sub-element lookup object on global mezzurite object
     * @param el 
     * @param key 
     */
    static getElNames(el: any, key: string){
        if ((<any>window).mezzurite.childElementNames[key] === undefined){
            (<any>window).mezzurite.childElementNames[key] = [];
        }
        if (el.tagName === 'IMG'){
            (<any>window).mezzurite.childElementNames[key].push(el.src);
        }
    }

    /**
     * Calculates slowest resource within a given component element
     * @param el parent element
     * @param fullName component fullname
     */
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

    static calculateSlowestResourceBatch(){
        const elementDict = (<any>window).mezzurite.elementLookup;
        for (let prop in elementDict){
            let slow = this.calculateSlowestResource(elementDict[prop], prop);
            if (slow === null){
                PerformanceTimingService.measure(prop)
            }
            else{
                PerformanceTimingService.measure(prop, slow)
            }
        }
    }
}