import { AutoMap } from '@automapper/classes';
import { COFINSTypeDTO } from "./COFINSTypeDTO";

export class COFINSDTO {
    @AutoMap(() => COFINSTypeDTO)
    COFINSType: COFINSTypeDTO;

    constructor(COFINSType: COFINSTypeDTO) {
        this.COFINSType = COFINSType;
    }
}
