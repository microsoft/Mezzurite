export class MezzuriteObject {
    firstViewLoaded: boolean;
    captureCycleStarted: boolean;
    measures: object;
    defaultLogs: object;
    childElementNames: object;
    slowestResource: object;
    currentComponents: object;
    vltComponentLookup: object;

    constructor() {
        this.firstViewLoaded = false;
        this.captureCycleStarted = false;
        this.measures = [];
        this.defaultLogs = [];
        this.childElementNames = {};
        this.slowestResource = {};
        this.currentComponents = {};
        this.vltComponentLookup = {};
    }
}