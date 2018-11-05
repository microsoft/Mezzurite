
# Mezzurite

The Mezzurite API standardizes the collection, logging and reporting of performance markers for Single Page Applications (SPA). Mezzurite allows you to collect Real User Monitoring (RUM) data, giving developers access to real world insight on performance issues customers might be facing.

## Features

Mezzurite captures a few different key timings:
1. **Application Load Time (ALT)**
  ⋅⋅* Captures time between when the url was requested until when the SPA framework is completely loaded. This mainly captures the network time, the server response time and time it takes to load the application framework into the DOM.
  ⋅⋅* To measure the ALT, we hook into the framework router, and record the first known route change. We subtract this time from the navigation start: ALT == #routeChange1 - navigationStart
  
2. **Component Load Time (CLT)**
  ⋅⋅* Time it takes for a component to load on the SPA page.
  ⋅⋅* To measure CLTs, we instrument individual components. We hook into the framework's component lifecycle and take the timings from the initialization method of the component. CLT = component init end - component init start
  
3. **Viewport Load Time (VLT**
  ⋅⋅* Time taken to render the part of SPA page that fits the viewport for the form factor on which page is being viewed. Components on the page that are outside of the viewport are, by definition, not considered while calculating this metric.
  ⋅⋅* To measure VLTs, we look at the individual components that have been recorded on the page as well as their current location in the DOM, then we find which one was the slowest within the viewport and subtract its time from the last route change that happened. VLT = (slowest component in viewport) init end (in ticks) - last route change time (in ticks)




[To read about contributing to this repo, click here](CONTRIBUTING.md)
