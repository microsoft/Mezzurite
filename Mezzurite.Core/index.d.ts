declare global {
  interface Window {
    mezzurite: {
      EventElement: Element;
      captureCycleStarted: boolean;
      captureTimer: function;
      defaultLogs: Array<object>;
      elementLookup: object;
      endTime: number;
      firstViewLoaded: boolean;
      measures: Array<{
        clt: number;
        endTime: number;
        id: string;
        name: string;
        slowResource: {
          endTime: number;
          name: string;
        };
        startTime: number;
        untilMount: number;
      }>;
      packageName: string;
      packageVersion: string;
      routeUrl: string;
      routerPerf: boolean;
      slowestResource: {
        endTime: number;
        name: string;
      };
      startTime: number;
      viewportHeight: number;
      viewportWidth: number;
      vltComponentLookup: object;
    }
  }
}

export default global;
