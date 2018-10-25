// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {MezzuriteObject} from './performance-global';
import {MezzuriteConstants} from './performance-constants';

/**
 * Class of utility functions for Mezzurite
 */
export class MezzuriteUtils {
    constructor() { }

    static createMezzuriteObject(): void {
        (<any>window).mezzurite = new MezzuriteObject();
    };
 

    static testReset(): void{
        let obj = (<any>window).mezzurite;
        obj.childElementNames = {};
        obj.slowestResource = {};
        obj.currentComponents = {};
        obj.vltComponentLookup = {};
        (<any>window).mezzurite = obj;
    }

    static makeId(): string {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < MezzuriteConstants.idLength; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));    
        }
        return text;
    };

    static getFunctionName(fun: any): string {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }

    static getDisplayName(WrappedComponent: any): any {
        if (WrappedComponent.name !== undefined){
            return WrappedComponent.name;
        }
        return MezzuriteUtils.getFunctionName(WrappedComponent);
    };

    static getName(name: string, key: string, clarifier: string = null): string{
        if (clarifier === null){
            return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key;
        }
        else{
            return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key + ";" + clarifier;
        }
    };

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

    static walkDOM(node: any, key: string, func: any) {
        func(node, key);
        node = node.firstChild;
        while(node) {
            MezzuriteUtils.walkDOM(node, key, func);
            node = node.nextSibling;
        }
    };

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