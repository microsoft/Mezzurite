// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {MezzuriteObject} from '../utils/performance-global';
import {MezzuriteConstants} from '../utils/performance-constants';
import {environment} from '../utils/core-environment';

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
        this.addCustomEventPolyfill();
        const mzObj = new MezzuriteObject();
        for (const prop in mzObj) {
            if (obj[prop] === undefined) {
                obj[prop] = (<any>mzObj)[prop];
            }
        }
        obj.coreVersion = environment.version;
    }

    /**
     * Resets certain properties in window.mezzurite after capture cycle is completed
     */
    static testReset(): void {
        const obj = (<any>window).mezzurite;
        obj.childElementNames = {};
        obj.slowestResource = {};
        obj.currentComponents = {};
        obj.vltComponentLookup = {};
        obj.elementLookup = {};
        (<any>window).mezzurite = obj;
    }

    /**
     * Creates a unique alpha-numeric key
     */
    static makeId(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < MezzuriteConstants.idLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Gets string name of the given function
     * @param fun function
     */
    static getFunctionName(fun: any): string {
        let ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }

    /**
     * Gets name of a given component passed into Mezzurite HOC
     * @param WrappedComponent Component
     */
    static getDisplayName(WrappedComponent: any): any {
        if (WrappedComponent.name !== undefined) {
            return WrappedComponent.name;
        }
        return MezzuriteUtils.getFunctionName(WrappedComponent);
    }

    /**
     * Gets complete name consisting of prefix, component name, and unique key.
     * @param name component name
     * @param key unique key
     * @param clarifier optional clarifier
     */
    static getName(name: string, key: string): string {
        return MezzuriteConstants.measureNamePrefix + ';' + name + ';' + key;
    }

    /**
     * Creates metric to save to global mezzurite object
     * @param metricType metric type
     * @param value measured value
     * @param data json metadata
     */
    static createMetric(metricType: string, value: number, data: any = null): any {
        const obj: any = {
            metricType: metricType,
            value: value % 1 !== 0 ? parseFloat(value.toFixed(1)) : value
        };
        if (data !== null) {
            obj.data = JSON.stringify(data);
        }
        return obj;
    }

    /**
     * Walks DOM of a given element
     * @param node DOM node
     * @param key unique identifier
     * @param func callback function
     */
    static walkDOM(node: any, key: string, func: any) {
        func(node, key);
        node = node.firstChild;
        while (node) {
            MezzuriteUtils.walkDOM(node, key, func);
            node = node.nextSibling;
        }
    }

    /**
     * Gets fragment from full name
     * @param fullName full name
     * @param val value to pull
     */
    static getFullNamePart(fullName: string, val: string) {
        const arr = fullName.split(';');
        switch (val) {
            case MezzuriteConstants.fullNamePartTitle:
            return arr[1];
            case MezzuriteConstants.fullNamePartKey:
            return arr[2];
            default:
            return fullName;
        }
    }

    /**
     * Polyfill that adds CustomEvent for IE usage
     */
    static addCustomEventPolyfill() {
        if ( typeof (<any>window).CustomEvent === 'function' ) {
            return false;
        }

        function CustomEvent ( event: string, params: any ) {
          params = params || { bubbles: false, cancelable: false, detail: undefined };
          const evt = document.createEvent( 'CustomEvent' );
          evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
          return evt;
         }

        CustomEvent.prototype = (<any>window).Event.prototype;
        (<any>window).CustomEvent = CustomEvent;
    }
}