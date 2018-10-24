// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class MezzuriteObject {
    firstViewLoaded: boolean;
    captureCycleStarted: boolean;
    measures: object;
    defaultLogs: object;
    childElementNames: object;
    slowestResource: object;
    currentComponents: object;
    vltComponentLookup: object;

    constructor(obj: MezzuriteObject = new MezzuriteObject()) {
        obj.firstViewLoaded = false;
        obj.captureCycleStarted = false;
        obj.measures = [];
        obj.defaultLogs = [];
        obj.childElementNames = {};
        obj.slowestResource = {};
        obj.currentComponents = {};
        obj.vltComponentLookup = {};
    }
}