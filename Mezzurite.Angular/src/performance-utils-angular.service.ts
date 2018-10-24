import { MezzuriteUtils } from "@ms/mezzurite-core";
import pkg from '../package.json';

export class MezzuriteAngularUtils extends MezzuriteUtils{
    static createMezzuriteObject(){
        super.createMezzuriteObject();
        (<any>window).mezzurite.packageVersion = pkg.version;
        (<any>window).mezzurite.packageName = pkg.name;
    }
}