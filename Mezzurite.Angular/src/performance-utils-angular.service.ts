import { MezzuriteUtils } from "@ms/mezzurite-core";
import package from '../package.json';

export class MezzuriteAngularUtils extends MezzuriteUtils{
    static createMezzuriteObject(){
        super.createMezzuriteObject();
        (<any>window).mezzurite.packageVersion = package.version;
        (<any>window).mezzurite.packageName = package.name;
    }
}