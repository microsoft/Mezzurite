// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {MezzuriteUtils} from '../services/performance-utils.service';
import {MezzuriteConstants} from '../utils/performance-constants';

function myTestFunction(){
  console.log("this is a test!");
}

describe("Mezzurite Utils Tests:", () => {
  it('Get function name works as expected', () => {  
    expect(MezzuriteUtils.getFunctionName(myTestFunction)).toBe("myTestFunction");
  });
  
  it('Get name works as expected', () => {  
    expect(MezzuriteUtils.getName("myComponent", "abc123")).toBe(MezzuriteConstants.measureNamePrefix + ";myComponent;abc123");
  });
  
  it('Get full name part works as expected', () => {  
    const fullName = "mz;myComponent;abc123";
    expect(MezzuriteUtils.getFullNamePart(fullName, MezzuriteConstants.fullNamePartKey)).toBe("abc123");
    expect(MezzuriteUtils.getFullNamePart(fullName, MezzuriteConstants.fullNamePartTitle)).toBe("myComponent");
    expect(MezzuriteUtils.getFullNamePart(fullName, "pizza")).toBe(fullName);
  });
})






