// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {MezzuriteObject} from './performance-global';
import {MezzuriteConstants} from './performance-constants';

/**
 * Class of utility functions for Mezzurite
 */
export class MezzuriteUtils {
    constructor() { }

    /**
     * Adds default values for MezzuriteObject to the global window.mezzurite object
     * @param obj existing mezzurite global object (if already created by logger)
     */
    static createMezzuriteObject(obj: any): void {
        var mzObj = new MezzuriteObject();
        for (var prop in mzObj){
            obj[prop] = (<any>mzObj)[prop];
        }
    };
 
    /**
     * Resets certain properties in window.mezzurite after capture cycle is completed
     */
    static testReset(): void{
        let obj = (<any>window).mezzurite;
        obj.childElementNames = {};
        obj.slowestResource = {};
        obj.currentComponents = {};
        obj.vltComponentLookup = {};
        (<any>window).mezzurite = obj;
    }

    /**
     * Creates a unique alpha-numeric key
     */
    static makeId(): string {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < MezzuriteConstants.idLength; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));    
        }
        return text;
    };

    /**
     * Gets string name of the given function
     * @param fun function
     */
    static getFunctionName(fun: any): string {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }

    /**
     * Gets name of a given component passed into Mezzurite HOC
     * @param WrappedComponent Component
     */
    static getDisplayName(WrappedComponent: any): any {
        if (WrappedComponent.name !== undefined){
            return WrappedComponent.name;
        }
        return MezzuriteUtils.getFunctionName(WrappedComponent);
    };

    /**
     * Gets complete name consisting of prefix, component name, and unique key.
     * @param name component name
     * @param key unique key
     * @param clarifier optional clarifier
     */
    static getName(name: string, key: string, clarifier: string = null): string{
        if (clarifier === null){
            return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key;
        }
        else{
            return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key + ";" + clarifier;
        }
    };

    /**
     * Creates metric to save to global mezzurite object
     * @param metricType metric type
     * @param value measured value
     * @param data json metadata
     */
    static createMetric(metricType: string, value: number, data: any = null): any{
        var obj: any = {
            metricType: metricType,
            value: value
        }
        if (data !== null){
            obj.data = JSON.stringify(data)
        }
        return obj;
    };

    /**
     * Walks DOM of a given element
     * @param node DOM node
     * @param key unique identifier
     * @param func callback function
     */
    static walkDOM(node: any, key: string, func: any) {
        func(node, key);
        node = node.firstChild;
        while(node) {
            MezzuriteUtils.walkDOM(node, key, func);
            node = node.nextSibling;
        }
    };

    /**
     * Gets fragment from full name
     * @param fullName full name
     * @param val value to pull
     */
    static getFullNamePart(fullName: string, val: string){
        const arr = fullName.split(";");
        switch (val){
            case MezzuriteConstants.fullNamePartTitle:
            return arr[1];
            case MezzuriteConstants.fullNamePartKey:
            return arr[2];
            default:
            return null;
        }
    }
}