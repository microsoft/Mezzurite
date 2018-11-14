(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.MezzuriteCore = {})));
}(this, (function (exports) { 'use strict';

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    /**
     * Global Mezzurite constants
     */
    var MezzuriteConstants = {
        captureCycleTimeout: 10000,
        slowestResourceTimeout: 4000,
        idLength: 6,
        domAttributeName: "perf-id",
        measureNamePrefix: "mz",
        altName: "ALT",
        vltName: "VLT",
        vltMarkStart: "VltStart",
        altMarkStart: "AltStart",
        altMarkEnd: "AltEnd",
        componentMarkStart: "ComponentStart",
        componentMarkEnd: "ComponentEnd",
        componentMarkRenderStart: "ComponentRenderStart",
        jsllConfigName: "jsll",
        versionName: "MezzuriteVersion",
        allComponents: "AllComponents",
        redirect: "Redirect",
        sessionData: "MezzuriteSession",
        fullNamePartTitle: "title",
        fullNamePartKey: "key",
        unsupportedBrowserName: "unsupportedBrowser",
        unsupportedBrowserPerf: "This was sent from a client using a browser that does not support the Performance API"
    };

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    /**
     * Global Mezzurite object
     */
    var MezzuriteObject = /** @class */ (function () {
        function MezzuriteObject() {
            this.firstViewLoaded = false;
            this.captureCycleStarted = false;
            this.routerPerf = false;
            this.measures = [];
            this.defaultLogs = [];
            this.childElementNames = {};
            this.slowestResource = {};
            this.currentComponents = {};
            this.vltComponentLookup = {};
        }
        return MezzuriteObject;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Class of utility functions for Mezzurite
     */
    var MezzuriteUtils = /** @class */ (function () {
        function MezzuriteUtils() {
        }
        /**
         * Adds default values for MezzuriteObject to the global window.mezzurite object
         * @param obj existing mezzurite global object (if already created by logger)
         */
        MezzuriteUtils.createMezzuriteObject = function (obj) {
            var mzObj = new MezzuriteObject();
            for (var prop in mzObj) {
                if (obj[prop] === undefined) {
                    obj[prop] = mzObj[prop];
                }
            }
        };
        /**
         * Resets certain properties in window.mezzurite after capture cycle is completed
         */
        MezzuriteUtils.testReset = function () {
            var obj = window.mezzurite;
            obj.childElementNames = {};
            obj.slowestResource = {};
            obj.currentComponents = {};
            obj.vltComponentLookup = {};
            window.mezzurite = obj;
        };
        /**
         * Creates a unique alpha-numeric key
         */
        MezzuriteUtils.makeId = function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < MezzuriteConstants.idLength; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        /**
         * Gets string name of the given function
         * @param fun function
         */
        MezzuriteUtils.getFunctionName = function (fun) {
            var ret = fun.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        };
        /**
         * Gets name of a given component passed into Mezzurite HOC
         * @param WrappedComponent Component
         */
        MezzuriteUtils.getDisplayName = function (WrappedComponent) {
            if (WrappedComponent.name !== undefined) {
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
        MezzuriteUtils.getName = function (name, key, clarifier) {
            if (clarifier === void 0) { clarifier = null; }
            if (clarifier === null) {
                return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key;
            }
            else {
                return MezzuriteConstants.measureNamePrefix + ";" + name + ";" + key + ";" + clarifier;
            }
        };
        /**
         * Creates metric to save to global mezzurite object
         * @param metricType metric type
         * @param value measured value
         * @param data json metadata
         */
        MezzuriteUtils.createMetric = function (metricType, value, data) {
            if (data === void 0) { data = null; }
            var obj = {
                metricType: metricType,
                value: value
            };
            if (data !== null) {
                obj.data = JSON.stringify(data);
            }
            return obj;
        };
        /**
         * Walks DOM of a given element
         * @param node DOM node
         * @param key unique identifier
         * @param func callback function
         */
        MezzuriteUtils.walkDOM = function (node, key, func) {
            func(node, key);
            node = node.firstChild;
            while (node) {
                MezzuriteUtils.walkDOM(node, key, func);
                node = node.nextSibling;
            }
        };
        /**
         * Gets fragment from full name
         * @param fullName full name
         * @param val value to pull
         */
        MezzuriteUtils.getFullNamePart = function (fullName, val) {
            var arr = fullName.split(";");
            switch (val) {
                case MezzuriteConstants.fullNamePartTitle:
                    return arr[1];
                case MezzuriteConstants.fullNamePartKey:
                    return arr[2];
                default:
                    return null;
            }
        };
        return MezzuriteUtils;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Class containing core timing functions
     */
    var PerformanceTimingService = /** @class */ (function () {
        function PerformanceTimingService() {
        }
        /**
         * Creates measure object from given set of performance marks
         * @param name full semicolon delimited name
         * @param slowestResource Slowest resource inside component
         * @param maxComponentEndTime Max component end time (if VLT)
         */
        PerformanceTimingService.measure = function (name, slowestResource, maxComponentEndTime) {
            if (slowestResource === void 0) { slowestResource = null; }
            if (maxComponentEndTime === void 0) { maxComponentEndTime = null; }
            var startEntry;
            var endEntry;
            var componentTitle = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartTitle);
            var key = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartKey);
            if (name === undefined) {
                return null;
            }
            if (componentTitle === MezzuriteConstants.altName) {
                // ALT
                endEntry = performance.getEntriesByName(MezzuriteConstants.altMarkEnd)[0];
            }
            else if (componentTitle === MezzuriteConstants.vltName) {
                // VLT
                startEntry = performance.getEntriesByName(MezzuriteConstants.vltMarkStart)[0];
                endEntry = {
                    startTime: maxComponentEndTime
                };
            }
            else {
                // Component
                startEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkStart)[0];
                endEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkEnd)[0];
            }
            // start time inside render hook
            var renderStartEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkRenderStart)[0];
            var startTime = startEntry !== undefined ? startEntry.startTime : 0;
            var endTime = endEntry.startTime;
            // reset end time to end of slowest resource if 
            if (slowestResource !== null && slowestResource.responseEnd > endTime) {
                endTime = slowestResource.responseEnd;
            }
            var mountDuration = endEntry.startTime - startTime;
            var totalDuration = endTime - startTime;
            var obj = {
                name: name,
                startTime: startTime,
                endTime: endTime,
                timeToMount: mountDuration,
                componentLoadTime: totalDuration
            };
            if (slowestResource && slowestResource.responseEnd >= startTime) {
                obj["slowestResourceEnd"] = slowestResource.responseEnd;
            }
            else if (slowestResource !== null) {
                obj["slowestResourceEnd"] = -1;
            }
            if (componentTitle !== MezzuriteConstants.altName && componentTitle !== MezzuriteConstants.vltName && renderStartEntry) {
                obj["renderStartTime"] = renderStartEntry.startTime;
            }
            window.mezzurite.measures.push(obj);
        };
        /**
         * Gets a specific measure by name
         * @param name name
         */
        PerformanceTimingService.getMeasureByName = function (name) {
            if (name === undefined || name === null) {
                return null;
            }
            var measures = window.mezzurite.measures;
            for (var i = 0; i < measures.length; i++) {
                if (name === measures[i].name) {
                    return measures[i];
                }
            }
            return null;
        };
        /**
         * Gets current components from a given capture cycle
         */
        PerformanceTimingService.getCurrentComponents = function () {
            var components = window.mezzurite.measures.filter(function (m) {
                return m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
                    m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
                    m.startTime >= window.mezzurite.startTime &&
                    m.startTime <= window.mezzurite.endTime;
            });
            return components;
        };
        /**
         * Gets lookup object of current components
         */
        PerformanceTimingService.getCurrentComponentsLookup = function () {
            var components = window.mezzurite.measures.filter(function (m) {
                return m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.altName) === -1 &&
                    m.name.indexOf(MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName) === -1 &&
                    m.startTime >= window.mezzurite.startTime &&
                    m.startTime <= window.mezzurite.endTime;
            });
            var obj = {};
            for (var i = 0; i < components.length; i++) {
                var name = components[i].name;
                obj[name] = components[i];
            }
            return obj;
        };
        /**
         * Calculates viewport load time
         */
        PerformanceTimingService.calculateVlt = function () {
            var maxComponent = null;
            var vltComponents = [];
            var components = this.getCurrentComponentsLookup();
            var vltLookup = window.mezzurite.vltComponentLookup;
            var measure;
            for (var key in vltLookup) {
                if (components[key] && vltLookup[key] === true) {
                    vltComponents.push(components[key]);
                    if (maxComponent !== null) {
                        var slowestResourceEnd = 0;
                        var slowestResource = window.mezzurite.slowestResource[key];
                        if (slowestResource !== undefined && slowestResource !== null) {
                            slowestResourceEnd = slowestResource.responseEnd;
                        }
                        var maxLast = maxComponent.componentLoadTime + maxComponent.startTime;
                        var currLast = components[key].componentLoadTime + components[key].startTime;
                        if (currLast > maxLast) {
                            maxComponent = components[key];
                        }
                    }
                    else {
                        maxComponent = components[key];
                    }
                }
            }
            if (maxComponent !== null) {
                var key = MezzuriteUtils.getFullNamePart(maxComponent.name, MezzuriteConstants.fullNamePartKey);
                var vltName = MezzuriteConstants.measureNamePrefix + ";" + MezzuriteConstants.vltName + ";" + key;
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
            };
        };
        /**
         * Creates sub-element lookup object on global mezzurite object
         * @param el
         * @param key
         */
        PerformanceTimingService.getElNames = function (el, key) {
            if (window.mezzurite.childElementNames[key] === undefined) {
                window.mezzurite.childElementNames[key] = [];
            }
            if (el.tagName === 'IMG') {
                window.mezzurite.childElementNames[key].push(el.src);
            }
        };
        /**
         * Calculates slowest resource within a given component element
         * @param el parent element
         * @param fullName component fullname
         */
        PerformanceTimingService.calculateSlowestResource = function (el, fullName) {
            var key = MezzuriteUtils.getFullNamePart(fullName, MezzuriteConstants.fullNamePartKey);
            var slowestResource = null;
            MezzuriteUtils.walkDOM(el, key, this.getElNames);
            var resources = performance.getEntriesByType("resource").filter(function (r) { return r.initiatorType === 'img'; });
            var currentResources = window.mezzurite.childElementNames[key];
            if (resources.length === 0) {
                return;
            }
            for (var i = 0; i < currentResources.length; i++) {
                for (var j = 0; j < resources.length; j++) {
                    if (currentResources[i] === resources[j].name && (slowestResource === null || resources[j].responseEnd > slowestResource.responseEnd)) {
                        slowestResource = resources[j];
                    }
                }
            }
            window.mezzurite.slowestResource[fullName] = slowestResource;
            return slowestResource;
        };
        return PerformanceTimingService;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Class containing core telemetry functions
     */
    var PerformanceTelemetryService = /** @class */ (function () {
        function PerformanceTelemetryService() {
        }
        /**
         * Starts capture cycle period
         */
        PerformanceTelemetryService.startCaptureCycle = function () {
            if (!window.mezzurite.captureCycleStarted) {
                window.mezzurite.startTime = window.performance.now();
                window.mezzurite.captureCycleStarted = true;
                window.mezzurite.captureTimer = setTimeout(function () {
                    PerformanceTelemetryService.captureTimings();
                }, MezzuriteConstants.captureCycleTimeout);
            }
        };
        /**
         * Captures timings for the given period
         * @param isRedirect Bool dictating whether timings were captured at end of cycle or early
         */
        PerformanceTelemetryService.captureTimings = function (isRedirect) {
            if (isRedirect === void 0) { isRedirect = false; }
            clearTimeout(window.mezzurite.captureTimer);
            window.mezzurite.endTime = window.performance.now();
            if (!window.mezzurite.captureCycleStarted) {
                window.mezzurite.captureCycleStarted = true;
            }
            PerformanceTelemetryService.submitTelemetry(isRedirect);
            window.mezzurite.captureCycleStarted = false;
        };
        /**
         * Creates timings object to send to telemetry
         * @param isRedirect isRedirect bool
         */
        PerformanceTelemetryService.submitTelemetry = function (isRedirect) {
            var timings = [];
            // add redirect value
            timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.redirect, isRedirect === false ? 0 : 1));
            // all components
            var components = PerformanceTimingService.getCurrentComponents();
            if (window.mezzurite.routerPerf) {
                // alt
                if (window.mezzurite.firstViewLoaded === false) {
                    var altMeasure = window.mezzurite.measures.filter(function (m) { return m.name.indexOf(MezzuriteConstants.altName) > -1; })[0];
                    timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.altName, altMeasure.componentLoadTime));
                    window.mezzurite.firstViewLoaded = true;
                }
                // vlt
                if (components.length > 0) {
                    var vltResults = PerformanceTimingService.calculateVlt();
                    timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.vltName, vltResults.vlt, vltResults.components));
                }
            }
            if (components.length > 0) {
                timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.allComponents, -1, components));
            }
            this.log(timings);
            MezzuriteUtils.testReset();
        };
        /**
         * Adds remaining metadata to send to logger and dispatches event
         * @param timings
         */
        PerformanceTelemetryService.log = function (timings) {
            if (window.mezzurite) {
                if (timings.length > 1) {
                    var obj = {
                        Timings: timings,
                        Framework: {
                            name: window.mezzurite.packageName,
                            version: window.mezzurite.packageVersion
                        },
                        ViewportWidth: window.mezzurite.viewportWidth,
                        ViewportHeight: window.mezzurite.viewportHeight
                    };
                    // log to console when developing locally
                    if (window.location.href.indexOf("localhost") > -1) {
                        console.log("to log for testing: ", obj);
                    }
                    if (window.mezzurite.EventElement) {
                        window.mezzurite.EventElement.dispatchEvent(new CustomEvent('Timing', { detail: obj }));
                    }
                }
                else {
                    console.log("nothing for Mezzurite to log.");
                }
            }
        };
        /**
         * Checks whether window.performance is undefined
         */
        PerformanceTelemetryService.compatibilityCheck = function () {
            var isCompatible = (window.performance !== undefined);
            if (!isCompatible) {
                var timings = [MezzuriteUtils.createMetric(MezzuriteConstants.unsupportedBrowserName, -1, MezzuriteConstants.unsupportedBrowserPerf)];
                this.log(timings);
            }
            return isCompatible;
        };
        return PerformanceTelemetryService;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    /**
     * Class for a given performance metric
     */
    var PerfMetric = /** @class */ (function () {
        function PerfMetric() {
        }
        return PerfMetric;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.

    exports.PerformanceTelemetryService = PerformanceTelemetryService;
    exports.PerformanceTimingService = PerformanceTimingService;
    exports.PerfMetric = PerfMetric;
    exports.MezzuriteConstants = MezzuriteConstants;
    exports.MezzuriteUtils = MezzuriteUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
