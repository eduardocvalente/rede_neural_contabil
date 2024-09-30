import { AutoMap } from '@automapper/classes';
import { PISType } from "./PISType";

export class PIS {
    @AutoMap(() => PISType)
    PISType: PISType;

    constructor(PISType: PISType) {
        this.PISType = PISType;
    }
}
