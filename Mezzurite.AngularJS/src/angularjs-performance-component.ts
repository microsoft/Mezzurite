// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteConstants } from '@microsoft/mezzurite-core';
import { MezzuriteAngularJsUtils } from './angularjs-performance-utils.service';
import 'intersection-observer';

export class AngularJsPerfComponent {
  fullName: string;
  key: string;
  constructor (public name: string, public element: HTMLElement) {
    this.key = (MezzuriteAngularJsUtils as any).makeId();
    window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);
    this.fullName = MezzuriteConstants.measureNamePrefix + ';' + this.name + ';' + this.key;
    (window as any).mezzurite.elementLookup[this.fullName] = element;
    const config = {
      root: null, // setting it to 'null' sets it to default value: viewport
      rootMargin: '0px'
    };
    let that = this;
    let observer = new IntersectionObserver(function (entries, observer) {
      const entry = entries[0];
      (window as any).mezzurite.viewportWidth = entry.rootBounds.width;
      (window as any).mezzurite.viewportHeight = entry.rootBounds.height;
      if (that.fullName !== undefined) {
        if (entry.isIntersecting) {
          (window as any).mezzurite.vltComponentLookup[that.fullName] = true;
        } else {
          (window as any).mezzurite.vltComponentLookup[that.fullName] = false;
        }
      }
      observer.unobserve(that.element);
      that.element = null;
    }, config);
    observer.observe(this.element);
  }

  setComponentComplete () {
    window.performance.mark(this.key + MezzuriteConstants.componentMarkEnd);
  }
}
