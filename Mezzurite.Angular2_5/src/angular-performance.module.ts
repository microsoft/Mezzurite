// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NgModule, ModuleWithProviders } from "@angular/core";
import { PerformanceTimingService } from "@microsoft/mezzurite-core";
import { MezzuriteDirective } from './angular-performance-directive';
import { RoutingService } from "./routing.service";

@NgModule({
    declarations: [MezzuriteDirective],
    exports: [MezzuriteDirective]
})

/**
 * Mezzurite Performance Module for Angular
 */
export class AngularPerfModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: AngularPerfModule,
            providers: [
                { provide: PerformanceTimingService, useFactory: createPerfTimingService },
                RoutingService
                // Add new services here.
            ]
        };
    }
}

export function createPerfTimingService() {
    return new PerformanceTimingService();
}

export {
    PerformanceTimingService,
    RoutingService
    // Add new services here.
};