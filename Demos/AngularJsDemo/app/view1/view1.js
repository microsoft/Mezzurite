'use strict';

angular.module('AngularJsTestApp')
.controller('View1Ctrl', View1Ctrl);

View1Ctrl.$inject = ['$timeout', 'AngularJsPerfService'];

function View1Ctrl($timeout, AngularJsPerfService){
    var el = document.getElementById("component-1")
    var pie = document.getElementById("pie-component")
    var myComponent = AngularJsPerfService.initPerfComponent("testComponent", el)
    var pieComponent = AngularJsPerfService.initPerfComponent("pieComponent", pie)
    angular.element(el).ready(function(){
        myComponent.setComponentComplete();
    })
    angular.element(pie).ready(function(){
        pieComponent.setComponentComplete();
    })
};