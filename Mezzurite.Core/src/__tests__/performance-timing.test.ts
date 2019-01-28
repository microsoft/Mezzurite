// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PerformanceTimingService } from '../services/performance-timing.service';
import { MezzuriteConstants } from '../utils/performance-constants';
import { MezzuriteObject } from '../utils/performance-global';
import 'performance-polyfill';
const imageName = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.jpg';

(window as any).mezzurite = new MezzuriteObject();
(window as any).mezzurite.measures = [
  {
    clt: 5765.899,
    endTime: 5765.899,
    name: 'ALT',
    id: 'Wmh8rB',
    slowResource: { end: -1, name: imageName },
    startTime: 0,
    untilMount: 5765.899
  },
  {
    clt: 171.000,
    endTime: 5948.100,
    name: 'MyComponentName',
    id: 'KFtK8q',
    slowResource: { end: 5789.700, name: imageName },
    startTime: 5777.100,
    untilMount: 171.000
  },
  {
    clt: 169.799,
    endTime: 5948.700,
    name: 'MyFormComponent',
    id: 'riR8OO',
    startTime: 5778.900,
    untilMount: 169.799
  }
];
(window as any).mezzurite.vltComponentLookup = {
  'mz;MyComponentName;KFtK8q': true,
  'mz;MyFormComponent;riR8OO': true
};
(window as any).mezzurite.startTime = 0;
(window as any).mezzurite.endTime = 6000;

describe('Mezzurite Timing Service Tests:', () => {
  const testKey = 'abc123';
  const testTitle = 'testComponent';
  it('Create a measure works as expected', () => {
    const originalLength = (window as any).mezzurite.measures.length;
    performance.mark(testKey + MezzuriteConstants.componentMarkStart);
    performance.mark(testKey + MezzuriteConstants.componentMarkEnd);
    PerformanceTimingService.measure(MezzuriteConstants.measureNamePrefix + ';' + testTitle + ';' + testKey);
    expect((window as any).mezzurite.measures.length).toBe(originalLength + 1);
  });

  it('Get measure by name works as expected', () => {
    const measures: any[] | null = PerformanceTimingService.getMeasuresByName(testTitle);
    expect(measures !== null).toBeTruthy();
    if (measures !== null) {
      for (let i = 0; i < measures.length; i++) {
        expect(measures[i].clt !== null && measures[i].clt !== undefined).toBeTruthy();
      }
    }
  });

  it('Get current components works as expected', () => {
    const compCount = PerformanceTimingService.getCurrentComponents().length;
    expect(compCount > 0).toBeTruthy();
    (window as any).mezzurite.startTime = 6000;
    (window as any).mezzurite.endTime = 6001;
    const newCompCount = PerformanceTimingService.getCurrentComponents().length;
    expect(newCompCount === 0).toBeTruthy();
  });

  it('Calculate VLT works as expected', () => {
    (window as any).mezzurite.startTime = 0;
    (window as any).mezzurite.endTime = 6000;
    const vlt = PerformanceTimingService.calculateVlt();
    expect(vlt !== null && vlt.vlt).toBeTruthy();
    (window as any).mezzurite.vltComponentLookup = {};
    const newVlt = PerformanceTimingService.calculateVlt();
    expect(newVlt === null).toBeTruthy();
  });
});
