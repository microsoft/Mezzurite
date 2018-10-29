import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({ 
     selector: '[my-directive]' 
})
export class MyDirective implements OnInit {
    private el: HTMLElement;
    constructor(ref: ElementRef) {
        performance.mark("testMarkStart")
        this.el = ref.nativeElement;
        console.log("inside directive constructor!", this.el);
    }

    ngOnInit(){
        console.log("inside on init!");
        setTimeout(function(){
            performance.mark("testMarkEnd");
        })
    }
} 