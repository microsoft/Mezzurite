// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class MezzuriteObject {
    firstViewLoaded: boolean;
    captureCycleStarted: boolean;
    routerPerf: boolean;
    measures: object;
    defaultLogs: object;
    childElementNames: object;
    slowestResource: object;
    currentComponents: object;
    vltComponentLookup: object;

    constructor() {
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
}