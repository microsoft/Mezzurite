// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MezzuriteUtils } from "@microsoft/mezzurite-core";
import pkg from "../package";

/**
 * Extension of Mezzurite Utilities that gets package specific information
 */
export class MezzuriteReactUtils extends MezzuriteUtils{
    static createMezzuriteObject(obj){
        super.createMezzuriteObject(obj);
        window.mezzurite.packageVersion = pkg.version;
        window.mezzurite.packageName = pkg.name;
    }
}