import { AutoMap } from '@automapper/classes';
import { ICMSType } from "./ICMSType";

export class ICMS {
    @AutoMap(() => ICMSType)
    ICMSType: ICMSType;

    constructor(ICMSType: ICMSType) {
        this.ICMSType = ICMSType;
    }
}
