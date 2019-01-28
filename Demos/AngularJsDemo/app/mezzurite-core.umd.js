(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('@microsoft/mezzurite-core', ['exports'], factory) :
  (factory((global.mezzuriteCore = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   */
  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /** *
   * Global Mezzurite constants
    @type {?} */
  var MezzuriteConstants = {
      mezzuriteObjectVersion: '1.0.0',
      captureCycleTimeout: 10000,
      slowestResourceTimeout: 4000,
      idLength: 6,
      domAttributeName: 'perf-id',
      measureNamePrefix: 'mz',
      altName: 'ALT',
      vltName: 'VLT',
      fvltName: 'FVLT',
      vltMarkStart: 'VltStart',
      altMarkStart: 'AltStart',
      altMarkEnd: 'AltEnd',
      componentMarkStart: 'ComponentStart',
      componentMarkEnd: 'ComponentEnd',
      componentMarkRenderStart: 'ComponentRenderStart',
      jsllConfigName: 'jsll',
      versionName: 'MezzuriteVersion',
      allComponents: 'AllComponents',
      redirect: 'Redirect',
      sessionData: 'MezzuriteSession',
      fullNamePartTitle: 'title',
      fullNamePartKey: 'key',
      unsupportedBrowserName: 'unsupportedBrowser',
      unsupportedBrowserPerf: 'This was sent from a client using a browser that does not support the Performance API'
  };

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Global Mezzurite object
   */
  var /**
   * Global Mezzurite object
   */
  MezzuriteObject = /** @class */ (function () {
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
          this.elementLookup = {};
      }
      return MezzuriteObject;
  }());

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Class of utility functions for Mezzurite
   */
  var   /**
   * Class of utility functions for Mezzurite
   */
  MezzuriteUtils = /** @class */ (function () {
      function MezzuriteUtils() {
      }
      /**
       * Adds default values for MezzuriteObject to the global window.mezzurite object
       * @param obj existing mezzurite global object (if already created by logger)
       */
      /**
       * Adds default values for MezzuriteObject to the global window.mezzurite object
       * @param {?} obj existing mezzurite global object (if already created by logger)
       * @return {?}
       */
      MezzuriteUtils.createMezzuriteObject = /**
       * Adds default values for MezzuriteObject to the global window.mezzurite object
       * @param {?} obj existing mezzurite global object (if already created by logger)
       * @return {?}
       */
      function (obj) {
          this.addCustomEventPolyfill();
          /** @type {?} */
          var mzObj = new MezzuriteObject();
          for (var prop in mzObj) {
              if (obj[prop] === undefined) {
                  obj[prop] = (/** @type {?} */ (mzObj))[prop];
              }
          }
      };
      /**
       * Resets certain properties in window.mezzurite after capture cycle is completed
       */
      /**
       * Resets certain properties in window.mezzurite after capture cycle is completed
       * @return {?}
       */
      MezzuriteUtils.testReset = /**
       * Resets certain properties in window.mezzurite after capture cycle is completed
       * @return {?}
       */
      function () {
          /** @type {?} */
          var obj = (/** @type {?} */ (window)).mezzurite;
          obj.childElementNames = {};
          obj.slowestResource = {};
          obj.currentComponents = {};
          obj.vltComponentLookup = {};
          obj.elementLookup = {};
          (/** @type {?} */ (window)).mezzurite = obj;
      };
      /**
       * Creates a unique alpha-numeric key
       */
      /**
       * Creates a unique alpha-numeric key
       * @return {?}
       */
      MezzuriteUtils.makeId = /**
       * Creates a unique alpha-numeric key
       * @return {?}
       */
      function () {
          /** @type {?} */
          var text = '';
          /** @type {?} */
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < MezzuriteConstants.idLength; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
      };
      /**
       * Gets string name of the given function
       * @param fun function
       */
      /**
       * Gets string name of the given function
       * @param {?} fun function
       * @return {?}
       */
      MezzuriteUtils.getFunctionName = /**
       * Gets string name of the given function
       * @param {?} fun function
       * @return {?}
       */
      function (fun) {
          /** @type {?} */
          var ret = fun.toString();
          ret = ret.substr('function '.length);
          ret = ret.substr(0, ret.indexOf('('));
          return ret;
      };
      /**
       * Gets name of a given component passed into Mezzurite HOC
       * @param WrappedComponent Component
       */
      /**
       * Gets name of a given component passed into Mezzurite HOC
       * @param {?} WrappedComponent Component
       * @return {?}
       */
      MezzuriteUtils.getDisplayName = /**
       * Gets name of a given component passed into Mezzurite HOC
       * @param {?} WrappedComponent Component
       * @return {?}
       */
      function (WrappedComponent) {
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
      /**
       * Gets complete name consisting of prefix, component name, and unique key.
       * @param {?} name component name
       * @param {?} key unique key
       * @return {?}
       */
      MezzuriteUtils.getName = /**
       * Gets complete name consisting of prefix, component name, and unique key.
       * @param {?} name component name
       * @param {?} key unique key
       * @return {?}
       */
      function (name, key) {
          return MezzuriteConstants.measureNamePrefix + ';' + name + ';' + key;
      };
      /**
       * Creates metric to save to global mezzurite object
       * @param metricType metric type
       * @param value measured value
       * @param data json metadata
       */
      /**
       * Creates metric to save to global mezzurite object
       * @param {?} metricType metric type
       * @param {?} value measured value
       * @param {?=} data json metadata
       * @return {?}
       */
      MezzuriteUtils.createMetric = /**
       * Creates metric to save to global mezzurite object
       * @param {?} metricType metric type
       * @param {?} value measured value
       * @param {?=} data json metadata
       * @return {?}
       */
      function (metricType, value, data) {
          if (data === void 0) { data = null; }
          /** @type {?} */
          var obj = {
              metricType: metricType,
              value: value % 1 !== 0 ? parseFloat(value.toFixed(1)) : value
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
      /**
       * Walks DOM of a given element
       * @param {?} node DOM node
       * @param {?} key unique identifier
       * @param {?} func callback function
       * @return {?}
       */
      MezzuriteUtils.walkDOM = /**
       * Walks DOM of a given element
       * @param {?} node DOM node
       * @param {?} key unique identifier
       * @param {?} func callback function
       * @return {?}
       */
      function (node, key, func) {
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
      /**
       * Gets fragment from full name
       * @param {?} fullName full name
       * @param {?} val value to pull
       * @return {?}
       */
      MezzuriteUtils.getFullNamePart = /**
       * Gets fragment from full name
       * @param {?} fullName full name
       * @param {?} val value to pull
       * @return {?}
       */
      function (fullName, val) {
          /** @type {?} */
          var arr = fullName.split(';');
          switch (val) {
              case MezzuriteConstants.fullNamePartTitle:
                  return arr[1];
              case MezzuriteConstants.fullNamePartKey:
                  return arr[2];
              default:
                  return fullName;
          }
      };
      /**
       * Polyfill that adds CustomEvent for IE usage
       */
      /**
       * Polyfill that adds CustomEvent for IE usage
       * @return {?}
       */
      MezzuriteUtils.addCustomEventPolyfill = /**
       * Polyfill that adds CustomEvent for IE usage
       * @return {?}
       */
      function () {
          if (typeof (/** @type {?} */ (window)).CustomEvent === 'function') {
              return false;
          }
          /**
           * @param {?} event
           * @param {?} params
           * @return {?}
           */
          function CustomEvent(event, params) {
              params = params || { bubbles: false, cancelable: false, detail: undefined };
              /** @type {?} */
              var evt = document.createEvent('CustomEvent');
              evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
              return evt;
          }
          CustomEvent.prototype = (/** @type {?} */ (window)).Event.prototype;
          (/** @type {?} */ (window)).CustomEvent = CustomEvent;
      };
      return MezzuriteUtils;
  }());

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Mezzurite Measure
   */
  var /**
   * Mezzurite Measure
   */
  MezzuriteMeasure = /** @class */ (function () {
      function MezzuriteMeasure() {
      }
      return MezzuriteMeasure;
  }());

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Class containing core timing functions
   */
  var   /**
   * Class containing core timing functions
   */
  PerformanceTimingService = /** @class */ (function () {
      function PerformanceTimingService() {
      }
      /**
       * Creates measure object from given set of performance marks
       * @param name full semicolon delimited name
       * @param slowestResource Slowest resource inside component
       * @param maxComponentEndTime Max component end time (if VLT)
       */
      /**
       * Creates measure object from given set of performance marks
       * @param {?} name full semicolon delimited name
       * @param {?=} slowestResource Slowest resource inside component
       * @param {?=} maxComponentEndTime Max component end time (if VLT)
       * @return {?}
       */
      PerformanceTimingService.measure = /**
       * Creates measure object from given set of performance marks
       * @param {?} name full semicolon delimited name
       * @param {?=} slowestResource Slowest resource inside component
       * @param {?=} maxComponentEndTime Max component end time (if VLT)
       * @return {?}
       */
      function (name, slowestResource, maxComponentEndTime) {
          if (slowestResource === void 0) { slowestResource = null; }
          if (maxComponentEndTime === void 0) { maxComponentEndTime = null; }
          /** @type {?} */
          var startEntry;
          /** @type {?} */
          var endEntry;
          /** @type {?} */
          var componentTitle = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartTitle);
          /** @type {?} */
          var key = MezzuriteUtils.getFullNamePart(name, MezzuriteConstants.fullNamePartKey);
          if (name === undefined) {
              return;
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
          /** @type {?} */
          var renderStartEntry = performance.getEntriesByName(key + MezzuriteConstants.componentMarkRenderStart)[0];
          /** @type {?} */
          var startTime = startEntry !== undefined ? startEntry.startTime : 0;
          /** @type {?} */
          var endTime = endEntry.startTime;
          // reset end time to end of slowest resource if
          if (slowestResource !== null && slowestResource.responseEnd > endTime) {
              endTime = slowestResource.responseEnd;
          }
          /** @type {?} */
          var mountDuration = endEntry.startTime - startTime;
          /** @type {?} */
          var totalDuration = endTime - startTime;
          /** @type {?} */
          var nameArr = name.split(';');
          /** @type {?} */
          var obj = new MezzuriteMeasure();
          obj.name = nameArr[1];
          obj.id = nameArr[2];
          obj.startTime = startTime % 1 !== 0 ? parseFloat(startTime.toFixed(1)) : startTime;
          obj.endTime = parseFloat(endTime.toFixed(1));
          obj.untilMount = parseFloat(mountDuration.toFixed(1));
          obj.clt = parseFloat(totalDuration.toFixed(1));
          obj.slowResource = {};
          if (slowestResource && slowestResource.responseEnd >= startTime) {
              (/** @type {?} */ (obj)).slowResource['endTime'] = parseFloat(slowestResource.responseEnd.toFixed(1));
              (/** @type {?} */ (obj)).slowResource['name'] = slowestResource.name;
          }
          else if (slowestResource !== null) {
              (/** @type {?} */ (obj)).slowResource['endTime'] = -1;
              (/** @type {?} */ (obj)).slowResource['name'] = slowestResource.name;
          }
          if (componentTitle !== MezzuriteConstants.altName && componentTitle !== MezzuriteConstants.vltName && renderStartEntry) {
              (/** @type {?} */ (obj))['renderStartTime'] = renderStartEntry.startTime;
          }
          (/** @type {?} */ (window)).mezzurite.measures.push(obj);
      };
      /**
       * Gets measures by name
       * @param name name
       */
      /**
       * Gets measures by name
       * @param {?} name name
       * @return {?}
       */
      PerformanceTimingService.getMeasuresByName = /**
       * Gets measures by name
       * @param {?} name name
       * @return {?}
       */
      function (name) {
          /** @type {?} */
          var result = [];
          if (name === undefined || name === null) {
              return null;
          }
          /** @type {?} */
          var measures = (/** @type {?} */ (window)).mezzurite.measures;
          for (var i = 0; i < measures.length; i++) {
              if (name === measures[i].name) {
                  result.push(measures[i]);
              }
          }
          return result;
      };
      /**
   * Gets a specific measure by id
   * @param id id
   */
      /**
       * Gets a specific measure by id
       * @param {?} id id
       * @return {?}
       */
      PerformanceTimingService.getMeasureById = /**
       * Gets a specific measure by id
       * @param {?} id id
       * @return {?}
       */
      function (id) {
          if (id === undefined || id === null) {
              return null;
          }
          /** @type {?} */
          var measures = (/** @type {?} */ (window)).mezzurite.measures;
          for (var i = 0; i < measures.length; i++) {
              if (id === measures[i].id) {
                  return measures[i];
              }
          }
          return null;
      };
      /**
  * Gets a specific measure by name and id
  * @param name name
  * @param id id
  */
      /**
       * Gets a specific measure by name and id
       * @param {?} name name
       * @param {?} id id
       * @return {?}
       */
      PerformanceTimingService.getMeasureByNameAndId = /**
       * Gets a specific measure by name and id
       * @param {?} name name
       * @param {?} id id
       * @return {?}
       */
      function (name, id) {
          if (name === undefined || name === null || id === undefined || id === null) {
              return null;
          }
          /** @type {?} */
          var measures = (/** @type {?} */ (window)).mezzurite.measures;
          for (var i = 0; i < measures.length; i++) {
              if (name === measures[i].name && id === measures[i].id) {
                  return measures[i];
              }
          }
          return null;
      };
      /**
       * Gets current components from a given capture cycle
       */
      /**
       * Gets current components from a given capture cycle
       * @return {?}
       */
      PerformanceTimingService.getCurrentComponents = /**
       * Gets current components from a given capture cycle
       * @return {?}
       */
      function () {
          /** @type {?} */
          var components = (/** @type {?} */ (window)).mezzurite.measures.filter(function (m) {
              return m.name.indexOf(MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.altName) === -1 &&
                  m.name.indexOf(MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.vltName) === -1 &&
                  m.startTime >= (/** @type {?} */ (window)).mezzurite.startTime &&
                  m.startTime <= (/** @type {?} */ (window)).mezzurite.endTime;
          });
          return components;
      };
      /**
       * Gets lookup object of current components
       */
      /**
       * Gets lookup object of current components
       * @return {?}
       */
      PerformanceTimingService.getCurrentComponentsLookup = /**
       * Gets lookup object of current components
       * @return {?}
       */
      function () {
          /** @type {?} */
          var components = (/** @type {?} */ (window)).mezzurite.measures.filter(function (m) {
              return m.name.indexOf(MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.altName) === -1 &&
                  m.name.indexOf(MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.vltName) === -1 &&
                  m.startTime >= (/** @type {?} */ (window)).mezzurite.startTime &&
                  m.startTime <= (/** @type {?} */ (window)).mezzurite.endTime;
          });
          /** @type {?} */
          var obj = {};
          for (var i = 0; i < components.length; i++) {
              obj[MezzuriteConstants.measureNamePrefix + ';' + components[i].name + ';' + components[i].id] = components[i];
          }
          return obj;
      };
      /**
       * Calculates viewport load time
       */
      /**
       * Calculates viewport load time
       * @return {?}
       */
      PerformanceTimingService.calculateVlt = /**
       * Calculates viewport load time
       * @return {?}
       */
      function () {
          /** @type {?} */
          var maxComponent = null;
          /** @type {?} */
          var vltComponents = [];
          /** @type {?} */
          var components = this.getCurrentComponentsLookup();
          /** @type {?} */
          var vltLookup = (/** @type {?} */ (window)).mezzurite.vltComponentLookup;
          /** @type {?} */
          var measure;
          for (var key in vltLookup) {
              if (components[key] && vltLookup[key] === true) {
                  vltComponents.push(components[key]);
                  if (maxComponent !== null) {
                      /** @type {?} */
                      var slowestResourceEnd = 0;
                      /** @type {?} */
                      var slowestResource = (/** @type {?} */ (window)).mezzurite.slowestResource[key];
                      if (slowestResource !== undefined && slowestResource !== null) {
                          slowestResourceEnd = slowestResource.responseEnd;
                      }
                      /** @type {?} */
                      var maxLast = maxComponent.clt + maxComponent.startTime;
                      /** @type {?} */
                      var currLast = components[key].clt + components[key].startTime;
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
              /** @type {?} */
              var fullName = MezzuriteConstants.measureNamePrefix + ';' + MezzuriteConstants.vltName + ';' + maxComponent.id;
              this.measure(fullName, null, maxComponent.endTime);
              measure = this.getMeasureByNameAndId(MezzuriteConstants.vltName, maxComponent.id);
              performance.clearMarks(MezzuriteConstants.vltMarkStart);
          }
          else {
              return null;
              // no components in view
          }
          return {
              vlt: measure.clt,
              components: vltComponents
          };
      };
      /**
       * Creates sub-element lookup object on global mezzurite object
       * @param el
       * @param key
       */
      /**
       * Creates sub-element lookup object on global mezzurite object
       * @param {?} el
       * @param {?} key
       * @return {?}
       */
      PerformanceTimingService.getElNames = /**
       * Creates sub-element lookup object on global mezzurite object
       * @param {?} el
       * @param {?} key
       * @return {?}
       */
      function (el, key) {
          if ((/** @type {?} */ (window)).mezzurite.childElementNames[key] === undefined) {
              (/** @type {?} */ (window)).mezzurite.childElementNames[key] = [];
          }
          if (el.tagName === 'IMG') {
              (/** @type {?} */ (window)).mezzurite.childElementNames[key].push(el.src);
          }
      };
      /**
       * Calculates slowest resource within a given component element
       * @param el parent element
       * @param fullName component fullname
       */
      /**
       * Calculates slowest resource within a given component element
       * @param {?} el parent element
       * @param {?} fullName component fullname
       * @return {?}
       */
      PerformanceTimingService.calculateSlowestResource = /**
       * Calculates slowest resource within a given component element
       * @param {?} el parent element
       * @param {?} fullName component fullname
       * @return {?}
       */
      function (el, fullName) {
          /** @type {?} */
          var key = MezzuriteUtils.getFullNamePart(fullName, MezzuriteConstants.fullNamePartKey);
          /** @type {?} */
          var slowestResource = null;
          MezzuriteUtils.walkDOM(el, key, this.getElNames);
          /** @type {?} */
          var resources = performance.getEntriesByType('resource').filter(function (r) { return (/** @type {?} */ (r)).initiatorType === 'img'; });
          /** @type {?} */
          var currentResources = (/** @type {?} */ (window)).mezzurite.childElementNames[key];
          if (resources.length === 0) {
              return;
          }
          for (var i = 0; i < currentResources.length; i++) {
              for (var j = 0; j < resources.length; j++) {
                  if (currentResources[i] === resources[j].name &&
                      (slowestResource === null || resources[j].responseEnd > slowestResource.responseEnd)) {
                      slowestResource = resources[j];
                  }
              }
          }
          (/** @type {?} */ (window)).mezzurite.slowestResource[fullName] = slowestResource;
          return slowestResource;
      };
      /**
       * @return {?}
       */
      PerformanceTimingService.calculateSlowestResourceBatch = /**
       * @return {?}
       */
      function () {
          /** @type {?} */
          var slow;
          /** @type {?} */
          var elementDict = (/** @type {?} */ (window)).mezzurite.elementLookup;
          for (var prop in elementDict) {
              slow = this.calculateSlowestResource(elementDict[prop], prop);
              if (slow === null) {
                  PerformanceTimingService.measure(prop);
              }
              else {
                  PerformanceTimingService.measure(prop, slow);
              }
          }
      };
      return PerformanceTimingService;
  }());

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Class containing core telemetry functions
   */
  var   /**
   * Class containing core telemetry functions
   */
  PerformanceTelemetryService = /** @class */ (function () {
      function PerformanceTelemetryService() {
      }
      /**
       * Starts capture cycle period
       */
      /**
       * Starts capture cycle period
       * @return {?}
       */
      PerformanceTelemetryService.startCaptureCycle = /**
       * Starts capture cycle period
       * @return {?}
       */
      function () {
          if (!(/** @type {?} */ (window)).mezzurite.captureCycleStarted) {
              (/** @type {?} */ (window)).mezzurite.startTime = window.performance.now();
              (/** @type {?} */ (window)).mezzurite.captureCycleStarted = true;
              (/** @type {?} */ (window)).mezzurite.captureTimer = setTimeout(function () {
                  PerformanceTelemetryService.captureTimings();
              }, MezzuriteConstants.captureCycleTimeout);
          }
      };
      /**
       * Captures timings for the given period
       * @param isRedirect Bool dictating whether timings were captured at end of cycle or early
       */
      /**
       * Captures timings for the given period
       * @param {?=} isRedirect Bool dictating whether timings were captured at end of cycle or early
       * @return {?}
       */
      PerformanceTelemetryService.captureTimings = /**
       * Captures timings for the given period
       * @param {?=} isRedirect Bool dictating whether timings were captured at end of cycle or early
       * @return {?}
       */
      function (isRedirect) {
          if (isRedirect === void 0) { isRedirect = false; }
          clearTimeout((/** @type {?} */ (window)).mezzurite.captureTimer);
          (/** @type {?} */ (window)).mezzurite.endTime = window.performance.now();
          if (!(/** @type {?} */ (window)).mezzurite.captureCycleStarted) {
              (/** @type {?} */ (window)).mezzurite.captureCycleStarted = true;
          }
          PerformanceTelemetryService.submitTelemetry(isRedirect);
          (/** @type {?} */ (window)).mezzurite.captureCycleStarted = false;
      };
      /**
       * Creates timings object to send to telemetry
       * @param isRedirect isRedirect bool
       */
      /**
       * Creates timings object to send to telemetry
       * @param {?} isRedirect isRedirect bool
       * @return {?}
       */
      PerformanceTelemetryService.submitTelemetry = /**
       * Creates timings object to send to telemetry
       * @param {?} isRedirect isRedirect bool
       * @return {?}
       */
      function (isRedirect) {
          /** @type {?} */
          var timings = [];
          // add redirect value
          timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.redirect, isRedirect === false ? 0 : 1));
          // calculate component measures off slowest resource values
          if ((/** @type {?} */ (window)).mezzurite.elementLookup !== {}) {
              PerformanceTimingService.calculateSlowestResourceBatch();
          }
          /** @type {?} */
          var components = PerformanceTimingService.getCurrentComponents();
          if ((/** @type {?} */ (window)).mezzurite.routerPerf) {
              // alt
              if ((/** @type {?} */ (window)).mezzurite.firstViewLoaded === false) {
                  /** @type {?} */
                  var altMeasure = (/** @type {?} */ (window)).mezzurite.measures.filter(function (m) { return m.name.indexOf(MezzuriteConstants.altName) > -1; })[0];
                  timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.altName, altMeasure.clt));
                  (/** @type {?} */ (window)).mezzurite.firstViewLoaded = true;
              }
              // vlt
              if (components.length > 0) {
                  /** @type {?} */
                  var vltResults = PerformanceTimingService.calculateVlt();
                  if (vltResults !== null) {
                      timings.push(MezzuriteUtils.createMetric(MezzuriteConstants.vltName, vltResults.vlt, vltResults.components));
                  }
              }
              if (components.length === 0) {
                  performance.clearMarks(MezzuriteConstants.vltMarkStart);
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
      /**
       * Adds remaining metadata to send to logger and dispatches event
       * @param {?} timings
       * @return {?}
       */
      PerformanceTelemetryService.log = /**
       * Adds remaining metadata to send to logger and dispatches event
       * @param {?} timings
       * @return {?}
       */
      function (timings) {
          if ((/** @type {?} */ (window)).mezzurite) {
              if (timings.length > 1) {
                  /** @type {?} */
                  var obj = {
                      Timings: timings,
                      Framework: {
                          name: (/** @type {?} */ (window)).mezzurite.packageName,
                          version: (/** @type {?} */ (window)).mezzurite.packageVersion
                      },
                      ViewportWidth: (/** @type {?} */ (window)).mezzurite.viewportWidth,
                      ViewportHeight: (/** @type {?} */ (window)).mezzurite.viewportHeight,
                      ObjectVersion: MezzuriteConstants.mezzuriteObjectVersion,
                      RouteUrl: (/** @type {?} */ (window)).mezzurite.routeUrl
                  };
                  // log to console when developing locally
                  if ((/** @type {?} */ (window)).location.href.indexOf('localhost') > -1) {
                      console.log('to log for testing: ', obj);
                  }
                  if ((/** @type {?} */ (window)).mezzurite.EventElement) {
                      (/** @type {?} */ (window)).mezzurite.EventElement.dispatchEvent(new CustomEvent('Timing', { detail: obj }));
                  }
              }
              else {
                  console.log('nothing for Mezzurite to log.');
              }
          }
      };
      /**
       * Checks whether window.performance is undefined
       */
      /**
       * Checks whether window.performance is undefined
       * @return {?}
       */
      PerformanceTelemetryService.compatibilityCheck = /**
       * Checks whether window.performance is undefined
       * @return {?}
       */
      function () {
          /** @type {?} */
          var isCompatible = (window.performance !== undefined);
          if (!isCompatible) {
              /** @type {?} */
              var timings = [
                  MezzuriteUtils.createMetric(MezzuriteConstants.unsupportedBrowserName, -1, MezzuriteConstants.unsupportedBrowserPerf)
              ];
              this.log(timings);
          }
          return isCompatible;
      };
      return PerformanceTelemetryService;
  }());

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
   */
  /**
   * Class for a given performance metric
   */
  var   /**
   * Class for a given performance metric
   */
  PerfMetric = /** @class */ (function () {
      function PerfMetric() {
      }
      return PerfMetric;
  }());

  exports.PerformanceTelemetryService = PerformanceTelemetryService;
  exports.PerformanceTimingService = PerformanceTimingService;
  exports.PerfMetric = PerfMetric;
  exports.MezzuriteConstants = MezzuriteConstants;
  exports.MezzuriteUtils = MezzuriteUtils;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mezzurite-core.umd.js.map
