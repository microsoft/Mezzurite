// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { module } from 'angular';
import { AngularJsRoutingService } from './angularjs-routing.service';
import { AngularJsPerfComponent } from './angularjs-performance-component';
import { AngularJsPerfService } from './angularjs-performance.service'
import { MezzuriteAngularJsUtils } from './angularjs-performance-utils.service'

export {
    AngularJsRoutingService,
    AngularJsPerfService,
    AngularJsPerfComponent,
    MezzuriteAngularJsUtils
}

module("angularjsrouting", [])
    .service("AngularJsRoutingService", AngularJsRoutingService)
    .service("AngularJsPerfService", AngularJsPerfService)
    