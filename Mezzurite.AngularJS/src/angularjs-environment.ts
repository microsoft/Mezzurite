// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import pkg from '../package.json';
/**
 * Gets information from package.json
 */
const environment = {
  version: pkg.version,
  name: pkg.name
};

export { environment };
