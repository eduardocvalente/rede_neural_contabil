import { AutoMap } from '@automapper/classes';
import { COFINSType } from "./COFINSType";

export class COFINS {
    @AutoMap(() => COFINSType)
    COFINSType: COFINSType;

    constructor(COFINSType: COFINSType) {
        this.COFINSType = COFINSType;
    }

}
