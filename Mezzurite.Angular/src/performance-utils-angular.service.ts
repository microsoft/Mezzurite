import { MezzuriteUtils } from "@ms/mezzurite-core";
import {environment} from "./environment";

export class MezzuriteAngularUtils extends MezzuriteUtils{
    static createMezzuriteObject(){
        super.createMezzuriteObject();
        (<any>window).mezzurite.packageVersion = environment.version;
        (<any>window).mezzurite.packageName = environment.name;
    }
}