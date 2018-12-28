// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PerformanceTelemetryService, MezzuriteConstants} from '@microsoft/mezzurite-core';
import { MezzuriteReactUtils } from '../services/performance-utils-react.service';
import { StateProvider } from '../services/state-provider.service';
import 'intersection-observer';

declare var ModifiedComponent: any;

/**
 * checks whether current component is class or stateless
 * @param {*} Component component
 */
function isStateless(Component: any) {
    return !Component.prototype.render;
}

/**
 * checks if withMezzuriteRouter is being implemented on the App
 */
function routerNotImplemented(){
    const routerNotImplementedBool = ((window as any).mezzurite.routerPerf === undefined || !(window as any).mezzurite.routerPerf);
    const listenerDoesntExistBool = ((window as any).mezzurite.listenerExists === undefined || !(window as any).mezzurite.listenerExists);
    return (routerNotImplementedBool && listenerDoesntExistBool)
}

/**
 * Higher order component for adding Mezzurite functionality to a React component
 * @param {*} WrappedComponent 
 */
const withMezzurite = (WrappedComponent: React.Component) => {
    if (!(window as any).mezzurite.isCompatible){
        console.warn("compatibility warning")
        return WrappedComponent;
    }
    
    if (isStateless(WrappedComponent)){
        ModifiedComponent = StateProvider(WrappedComponent);
    }
    else{
        ModifiedComponent = WrappedComponent;
    }



    return class withMezzuriteClass extends React.Component{
        key: string;
        displayName: string;
        fullName: string;
        wrappedRef: any;
        constructor(props: any){
            super(props);
                if (!(window as any).mezzurite){
                    // capture first load
                    (window as any).mezzurite = {};
                    MezzuriteReactUtils.createMezzuriteObject((window as any).mezzurite);
                    PerformanceTelemetryService.startCaptureCycle();
                }
                else{
                    MezzuriteReactUtils.createMezzuriteObject((window as any).mezzurite);
                }

                if ((window as any).mezzurite.isCompatible === undefined){
                    (window as any).mezzurite.isCompatible = PerformanceTelemetryService.compatibilityCheck();
                }

                this.key = ((this.props as any).location && (this.props as any).location.key) ? (this.props as any).location.key : MezzuriteReactUtils.makeId();
                window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);

                this.displayName = MezzuriteReactUtils.getDisplayName(WrappedComponent);

                // if not using mezzurite with React Router 4, adds click handler to capture events
                if (routerNotImplemented() && !(window as any).mezzurite.listenerExists)
                {
                    window.addEventListener('mousedown', this.clickStartCaptureCycle, {passive: true});
                    (window as any).mezzurite.listenerExists = true;
                }                
        }
        
        /**
         * Starts capture cycle on click when no routing service instrumented
         */
        clickStartCaptureCycle(){
            PerformanceTelemetryService.captureTimings = PerformanceTelemetryService.captureTimings.bind(this);
            PerformanceTelemetryService.startCaptureCycle();
        }

        componentDidMount(){
            let el: any = ReactDOM.findDOMNode(this.wrappedRef)
            this.fullName = MezzuriteReactUtils.getName(this.displayName, this.key);
            (window as any).mezzurite.elementLookup[this.fullName] = el;
            var that = this;

            const config = {
                root: null, // setting it to 'null' sets it to default value: viewport
                rootMargin: '0px'
            };
            
            if (!routerNotImplemented()){
                let observer = new IntersectionObserver(function(entries, observer) {
                    window.performance.mark(that.key + MezzuriteConstants.componentMarkEnd);
                    const entry = entries[0];
                    (window as any).mezzurite.viewportWidth = entry.rootBounds.width;
                    (window as any).mezzurite.viewportHeight = entry.rootBounds.height;
                    if (entry.isIntersecting){
                        (window as any).mezzurite.vltComponentLookup[that.fullName] = true;
                    }
                    observer.unobserve(el);
                    el = null;
                }, config);
                  observer.observe(el);
            }
        }

        /**
         * Sets the ref property
         */
        setRef(){
            this.wrappedRef = this;
        }

        render(){
            window.performance.mark(this.key + MezzuriteConstants.componentMarkRenderStart);
            return (
                <ModifiedComponent {...this.props} ref={ this.setRef.bind(this) } />
        )
        }
    }
}

export { withMezzurite };