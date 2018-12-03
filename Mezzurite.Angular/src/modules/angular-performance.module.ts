// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MezzuriteDirective } from '../components/angular-performance.directive';
import { RoutingService } from '../services/angular-routing.service';


@NgModule({
    declarations: [MezzuriteDirective],
    exports: [MezzuriteDirective]
})

/**
 * Mezzurite Performance Module for Angular
 */
export class AngularPerfModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AngularPerfModule,
            providers: [
                RoutingService
                // Add new services here.
            ]
        };
    }
}