// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {AngularJsPerfComponent} from './angularjs-performance-component'

export class AngularJsPerfService {
    initPerfComponent(name: string, element: HTMLElement){
        return new AngularJsPerfComponent(name, element);
    }
}
