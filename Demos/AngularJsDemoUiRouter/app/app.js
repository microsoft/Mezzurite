'use strict';

// Declare app level module which depends on views, and components
angular.module('AngularJsTestApp', [
  'ui.router',
  'angularjsrouting'
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/view1");

  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "view1/view1.html",
      controller: 'View1Ctrl'
    })
    .state('view1', {
      url: "/view1",
      templateUrl: "view1/view1.html",
      controller: 'View1Ctrl'
    })
    .state('view2', {
      url: "/view2",
      templateUrl: "view2/view2.html",
      controller: 'View2Ctrl'
    })

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

.run(['$rootScope', '$transitions', 'AngularJsRoutingService', function($rootScope, $transitions, AngularJsRoutingService){
  console.log('My app is cool: ' + new Date().getTime());  
  AngularJsRoutingService.start($rootScope, $transitions); 
}]);


