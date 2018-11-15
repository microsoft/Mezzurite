// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Gets information from package.json
 */
const environment = {
    version: require('../package.json').version,
    name: require('../package.json').name
};

export { environment }