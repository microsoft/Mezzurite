import React from 'react';
import ReactDOM from 'react-dom';
import {PerformanceTimingService, PerformanceTelemetryService, MezzuriteConstants} from '@ms/mezzurite-core';
import { MezzuriteReactUtils } from './performance-utils-react.service';
import { StateProvider } from './state-provider.service';
import 'intersection-observer';

// checks whether current component is class or stateless
function isStateless(Component) {
    return !Component.prototype.render;
}

// checks if withMezzuriteRouter is being implemented on the App
function routerNotImplemented(){
    const routerNotImplementedBool = (window.mezzurite.routerPerf === undefined || !window.mezzurite.routerPerf);
    const listenerDoesntExistBool = (window.mezzurite.listenerExists === undefined || !window.mezzurite.listenerExists);
    return (routerNotImplementedBool && listenerDoesntExistBool)
}

const withMezzurite = (WrappedComponent) => {
    var ModifiedComponent;

    if (isStateless(WrappedComponent)){
        ModifiedComponent = StateProvider(WrappedComponent);
    }
    else{
        ModifiedComponent = WrappedComponent;
    }

    return class withMezzuriteClass extends React.Component{
        constructor(props){
            super(props);
                if (!window.mezzurite){
                    // capture first load
                    MezzuriteReactUtils.createMezzuriteObject();
                    PerformanceTelemetryService.startCaptureCycle();
                }
                if (window.mezzurite.isCompatible === undefined){
                    window.mezzurite.isCompatible = PerformanceTelemetryService.compatibilityCheck();
                }
                if (!window.mezzurite.isCompatible){
                    console.warn("compatibility warning")
                    return WrappedComponent;
                }

                this.key = (this.props.location && this.props.location.key) ? this.props.location.key : MezzuriteReactUtils.makeId();
                window.performance.mark(this.key + MezzuriteConstants.componentMarkStart);

                this.displayName = MezzuriteReactUtils.getDisplayName(WrappedComponent);

                // if not using mezzurite with React Router 4, adds click handler to capture events
                if (routerNotImplemented() && !window.mezzurite.listenerExists)
                {
                    window.addEventListener('mousedown', this.clickStartCaptureCycle);
                    window.mezzurite.listenerExists = true;
                }                
        }
        

        clickStartCaptureCycle(){
            PerformanceTelemetryService.captureTimings = PerformanceTelemetryService.captureTimings.bind(this);
            PerformanceTelemetryService.startCaptureCycle();
        }

        componentDidMount(){
            const el = ReactDOM.findDOMNode(this.wrappedRef)
            this.fullName = MezzuriteReactUtils.getName(this.displayName, this.key);
            var that = this;

            // intersection observer config
            const config = {
                root: null, // setting it to 'null' sets it to default value: viewport
                rootMargin: '0px',
                threshold: [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1]
            };
            
            if (!routerNotImplemented()){
                let observer = new IntersectionObserver(function(entries) {
                    const entry = entries[0];
                    window.mezzurite.viewportWidth = entry.rootBounds.width;
                    window.mezzurite.viewportHeight = entry.rootBounds.height;
                    if (entry.intersectionRatio > 0){
                        window.mezzurite.vltComponentLookup[that.fullName] = true;
                    }
                    else{
                        window.mezzurite.vltComponentLookup[that.fullName] = false;
                    }
                }, config);
                  observer.observe(el);
            }

            window.requestAnimationFrame(() => {
                // component mount mark
                window.performance.mark(that.key + MezzuriteConstants.componentMarkEnd);
            });

            setTimeout(function(){
                const slow = PerformanceTimingService.calculateSlowestResource(el, that.fullName);
                if (slow === null){
                    PerformanceTimingService.measure(that.fullName)
                }
                else{
                    PerformanceTimingService.measure(that.fullName, slow)
                }
            },3000)
        }

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