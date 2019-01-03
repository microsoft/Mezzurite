[![npm version](https://badge.fury.io/js/%40microsoft%2Fmezzurite-angularjs.svg)](https://badge.fury.io/js/%40microsoft%2Fmezzurite-angularjs)

# Mezzurite-AngularJS
## Requirements:
```json
  "dependencies": {
    "@microsoft/mezzurite-core": "^1.0.1",
    "@types/angular": "^1.5.6",
    "@types/node": "^10.12.2",
    "intersection-observer": "^0.5.1", // IE support
    "reflect-metadata": "^0.1.8"
  },
  "peerDependencies": {
    "angular": "^1.6.6"
  },
```

## Onboarding

### Installation
 Install the mezzurite dependencies from npm:
```javascript
  npm install "@microsoft/mezzurite-core"
  npm install "@microsoft/mezzurite-angularjs"
```

### Basic Setup (Application Load Time)
1. Add UMD scripts to app:
```html
  <script src="/node_modules/@microsoft/mezzurite-core/browser/mezzurite.core.umd.js"></script>
  <script src="/node_modules/@microsoft/mezzurite-angularjs/browser/mezzurite.angularjs.umd.js"></script>
```
2. Inject Mezzurite module into app.module:
```javascript
angular.module('AngularJsTestApp', [
  'ngRoute',
  'angularjsrouting'
])
```
3. Inside the app run block, start the Mezzurite routing service:
```javascript
.run(['$rootScope', 'AngularJsRoutingService', function($rootScope, AngularJsRoutingService){
  AngularJsRoutingService.start($rootScope); 
}]);
```
### Component Tracking (CLT and VLT)
Because of inconsistent **angular.element(el).ready** timings, component start and stop currently need to be called manually.
```javascript
View1Ctrl.$inject = ['$timeout', 'AngularJsPerfService'];
function View1Ctrl($timeout, AngularJsPerfService){
    // must select element to be able to track position relative to viewport (for VLT)
    var el = document.getElementById("component-1")
    //create the component and start timing
    var myComponent = AngularJsPerfService.initPerfComponent("testComponent", el)
    // ...
    // ...
    // set your component complete
    $timeout(function(){
      myComponent.setComponentComplete();
    })
}
```
## FAQ
### 1. How do I check if my timings are logging correctly?
If running from localhost, a console.log should fire with the current timings. An alternate place to look for metrics is window.mezzurite.measures, which is where each component timing, as well as ALT and VLT, is saved.
### 2. What are UMD files ?
UMD stands for Universal Module Definition. As the name suggest, it's a universal pattern for writing modules in javascript. UMDs define modules that can work on both the client and server, as well as with all popular script loaders available at the moment. More details on UMD files can be found [here](https://github.com/umdjs/umd )
