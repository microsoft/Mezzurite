'use strict';

angular.module('AngularJsTestApp')
.controller('View1Ctrl', View1Ctrl);

View1Ctrl.$inject = ['AngularJsPerfService'];

function View1Ctrl(AngularJsPerfService){
    var image = document.getElementById("big-image-component")
    var box = document.getElementById("red-box-component")
    var imageComponent = AngularJsPerfService.initPerfComponent("imageComponent", image)
    var boxComponent = AngularJsPerfService.initPerfComponent("boxComponent", box)
    boxComponent.setComponentComplete();
    angular.element(image).ready(function(){
        imageComponent.setComponentComplete();
    })
};