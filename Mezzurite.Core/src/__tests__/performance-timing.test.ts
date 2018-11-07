// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PerformanceTimingService } from '../performance-timing.service';
import { MezzuriteConstants } from '../performance-constants';
import { MezzuriteObject } from '../performance-global';
import 'performance-polyfill';

(<any>window).mezzurite = new MezzuriteObject();
(<any>window).mezzurite.measures = [
  {componentLoadTime: 5765.89999999851, endTime: 5765.89999999851, name: "mz;ALT;Wmh8rB", slowestResourceEnd: -1, startTime: 0, timeToMount: 5765.89999999851},
  {componentLoadTime: 171.00000008940697, endTime: 5948.100000154227, name: "mz;MyComponentName;KFtK8q", slowestResourceEnd: 5789.700000081211, startTime: 5777.10000006482, timeToMount: 171.00000008940697},
  {componentLoadTime: 169.79999979957938, endTime: 5948.70000006631, name: "mz;MyFormComponent;riR8OO", startTime: 5778.900000266731, timeToMount: 169.79999979957938}
];
(<any>window).mezzurite.vltComponentLookup = {
  "mz;MyComponentName;KFtK8q": true,
  "mz;MyFormComponent;riR8OO": true
};
(<any>window).mezzurite.startTime = 0;
(<any>window).mezzurite.endTime = 6000;

describe("Mezzurite Timing Service Tests:", () => {
  const testKey = "abc123";
  const testTitle = "testComponent";
  it('Create a measure works as expected', () => {  
    const originalLength = (<any>window).mezzurite.measures.length;
    performance.mark(testKey + MezzuriteConstants.componentMarkStart);
    performance.mark(testKey + MezzuriteConstants.componentMarkEnd);
    PerformanceTimingService.measure(MezzuriteConstants.measureNamePrefix + ";" + testTitle + ";" + testKey);
    expect((<any>window).mezzurite.measures.length).toBe(originalLength + 1);
  });
  
  it('Get measure by name works as expected', () => {  
    const measure = PerformanceTimingService.getMeasureByName(MezzuriteConstants.measureNamePrefix + ";" + testTitle + ";" + testKey);
    expect(measure).toBeTruthy();
    expect(measure.componentLoadTime).toBeTruthy();
  });

  it('Get current components works as expected', () => {  
    const compCount = PerformanceTimingService.getCurrentComponents().length;
    expect(compCount > 0).toBeTruthy();
    (<any>window).mezzurite.startTime = 6000;
    (<any>window).mezzurite.endTime = 6001;
    const newCompCount = PerformanceTimingService.getCurrentComponents().length;
    expect(newCompCount === 0).toBeTruthy();
  });

  it('Calculate VLT works as expected', () => {  
    (<any>window).mezzurite.startTime = 0;
    (<any>window).mezzurite.endTime = 6000;
    const vlt = PerformanceTimingService.calculateVlt();
    expect(vlt.vlt).toBeTruthy();
    (<any>window).mezzurite.vltComponentLookup = {};
    const newVlt = PerformanceTimingService.calculateVlt();
    expect(newVlt === null).toBeTruthy();
  });
})






