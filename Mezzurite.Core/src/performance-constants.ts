// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Global Mezzurite constants
 */
const MezzuriteConstants = {
    captureCycleTimeout: 10000,
    slowestResourceTimeout: 4000,
    idLength: 6,
    domAttributeName: "perf-id",
    measureNamePrefix: "mz",
    altName: "ALT",
    vltName: "VLT",
    fvltName: "FVLT",
    vltMarkStart: "VltStart",
    altMarkStart: "AltStart",
    altMarkEnd: "AltEnd",
    componentMarkStart: "ComponentStart",
    componentMarkEnd: "ComponentEnd",
    componentMarkRenderStart: "ComponentRenderStart",
    jsllConfigName: "jsll",
    versionName: "MezzuriteVersion",
    allComponents: "AllComponents",
    redirect: "Redirect",
    sessionData: "MezzuriteSession",
    fullNamePartTitle: "title",
    fullNamePartKey: "key",
    unsupportedBrowserName: "unsupportedBrowser",
    unsupportedBrowserPerf: "This was sent from a client using a browser that does not support the Performance API"
}

export { MezzuriteConstants };