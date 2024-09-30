import { AutoMap } from '@automapper/classes';
import { ICMSTypeDTO } from "./ICMSTypeDTO";

export class ICMSDTO {
    @AutoMap(() => ICMSTypeDTO)
    public ICMSType: ICMSTypeDTO;

    constructor(ICMSType: ICMSTypeDTO) {
        this.ICMSType = ICMSType;
    }
}
