'use strict';

// Declare app level module which depends on views, and components
angular.module('AngularJsTestApp', [
  'ngRoute',
  'angularjsrouting'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  })
  .when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  })
  .when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  })
  .otherwise({redirectTo: '/view1'});
  $locationProvider.html5Mode(true).hashPrefix('!');
  
  const config = { 
    autoCapture: {    
    pageView: true,  
    onLoad: false, 
    click: true, 
    scroll: true,
    resize: true, 
    context: true, 
    jsError: true, 
    addin: true, 
    perf: true, 
    assets: true 
    },
    coreData: { 
      appId: "mezzuriteTest" 
    }, 
    consoleVerbosity: 1 
    }; 

    awa.init(config); 
    awa.cv.init(); 
}])

.run(['$rootScope', 'AngularJsRoutingService', function($rootScope, AngularJsRoutingService){
  console.log('My app is cool: ' + new Date().getTime());  
  console.log("routing service: ",AngularJsRoutingService);
  AngularJsRoutingService.start($rootScope); 
}]);


