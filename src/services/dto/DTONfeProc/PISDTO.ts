import { AutoMap } from '@automapper/classes';
import { PISTypeDTO } from "./PISTypeDTO";

export class PISDTO {
    @AutoMap(() => PISTypeDTO)
    PISType: PISTypeDTO;

    constructor(PISType: PISTypeDTO) {
        this.PISType = PISType;
    }
}
