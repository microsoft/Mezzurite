// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { MezzuriteUtils, MezzuriteConstants } from '@microsoft/mezzurite-core';
import 'intersection-observer';

@Directive({
     selector: '[mezzurite]'
})

/**
 * Directive that enables tracking on specific component elements
 */
export class MezzuriteDirective implements OnInit {

    private id: string;
    private fullName: string;
    private el: HTMLElement;
    // tslint:disable-next-line:no-input-rename
    @Input('component-title') title = 'MyComponent';

    constructor(ref: ElementRef) {
        this.id = MezzuriteUtils.makeId();
        performance.mark(this.id + MezzuriteConstants.componentMarkStart);
        this.el = ref.nativeElement;
    }

    ngOnInit() {
        this.fullName = MezzuriteUtils.getName(this.title, this.id);
        (<any>window).mezzurite.elementLookup[this.fullName] = this.el;
        const that = this;
        const config = {
            root: null as any, // setting it to 'null' sets it to default value: viewport
            rootMargin: '0px'
        };

        const intObserver = new IntersectionObserver(function(entries, observer) {
            performance.mark(that.id + MezzuriteConstants.componentMarkEnd);
            const entry = entries[0];
            (<any>window).mezzurite.viewportWidth = entry.rootBounds.width;
            (<any>window).mezzurite.viewportHeight = entry.rootBounds.height;
            if (entry.isIntersecting) {
                (<any>window).mezzurite.vltComponentLookup[that.fullName] = true;
            }
            observer.unobserve(that.el);
        }, config);
            intObserver.observe(this.el);
    }
}
