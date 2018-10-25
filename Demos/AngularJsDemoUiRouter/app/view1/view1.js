'use strict';

angular.module('AngularJsTestApp')
.controller('View1Ctrl', View1Ctrl);

View1Ctrl.$inject = ['AngularJsPerfTelemetryService', '$timeout'];

function View1Ctrl(AngularJsPerfTelemetryService, $timeout){
  console.log("view 1 controller");
  var perf = AngularJsPerfTelemetryService;
  perf.addComponent("testingthis");
  console.log("inside view 1 controller");
  $timeout(function(){
    perf.setComponentComplete("testingthis");
  },1000)
};