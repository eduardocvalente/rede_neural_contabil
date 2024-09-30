import { AutoMap } from '@automapper/classes';

export class PISTypeDTO {
    @AutoMap()
    CST: string;

    @AutoMap()
    vBC: string;

    @AutoMap()
    pPIS: string;

    @AutoMap()
    vPIS: string;

    constructor(CST: string, vBC: string, pPIS: string, vPIS: string) {
        this.CST = CST;
        this.vBC = vBC;
        this.pPIS = pPIS;
        this.vPIS = vPIS;
    }
}
