// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { MezzuriteUtils, MezzuriteConstants } from '@microsoft/mezzurite-core';

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
    @Input('component-title') title = 'MyComponent';

    constructor(ref: ElementRef) {
        this.id = MezzuriteUtils.makeId();
        performance.mark(this.id + MezzuriteConstants.componentMarkStart)
        this.el = ref.nativeElement;
        (<any>window).mezzurite.elementLookup[this.fullName] = this.el;
    }

    ngOnInit(){
        this.fullName = MezzuriteUtils.getName(this.title, this.id);
        const that = this;

        const config = {
            root: null as any, // setting it to 'null' sets it to default value: viewport
            rootMargin: '0px'
        };
        
        let observer = new IntersectionObserver(function(entries, observer) {
            performance.mark(that.id + MezzuriteConstants.componentMarkEnd)
            const entry = entries[0];
            if (entry.isIntersecting){
                (<any>window).mezzurite.viewportWidth = entry.rootBounds.width;
                (<any>window).mezzurite.viewportHeight = entry.rootBounds.height;
                (<any>window).mezzurite.vltComponentLookup[that.fullName] = true;
            }
            observer.unobserve(this.el);
            this.el = null;
        }, config);
            observer.observe(this.el);
    }
} 