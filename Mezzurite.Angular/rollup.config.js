// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    "@angular/router": "ng.router",
    "@microsoft/mezzurite-core": "mezzurite-core",
    'rxjs': 'rxjs',
    'rxjs/operators': 'rxjs.operators'
};

export default {
    external: Object.keys(globals),
    plugins: [resolve(), sourcemaps()],
    onwarn: () => { return },
    output: {
        format: 'umd',
        name: 'ng.mezzuriteAngular',
        globals: globals,
        sourcemap: true,
        exports: 'named',
        amd: { id: '@microsoft/mezzurite-angular' }
    }
}
