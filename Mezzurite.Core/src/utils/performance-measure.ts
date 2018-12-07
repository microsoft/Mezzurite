// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Mezzurite Measure
 */
export class MezzuriteMeasure {
    name: string;
    id: string;
    startTime: number;
    endTime: number;
    untilMount: number;
    clt: number;
    slowResource: object;
}