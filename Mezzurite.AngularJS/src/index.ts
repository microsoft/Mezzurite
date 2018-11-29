// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { module } from 'angular';
import { AngularJsRoutingService } from './angularjs-routing.service';
import { AngularJsPerfService } from './angularjs-performance.service'

module("angularjsrouting", [])
    .service("AngularJsRoutingService", AngularJsRoutingService)
    .service("AngularJsPerfService", AngularJsPerfService)
    