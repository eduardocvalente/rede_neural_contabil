import { AutoMap } from '@automapper/classes';

export class COFINSType {
    @AutoMap()
    CST: string;

    @AutoMap()
    vBC: string;

    @AutoMap()
    pCOFINS: string;

    @AutoMap()
    vCOFINS: string;

    constructor(CST: string, vBC: string, pCOFINS: string, vCOFINS: string) {
        this.CST = CST;
        this.vBC = vBC;
        this.pCOFINS = pCOFINS;
        this.vCOFINS = vCOFINS;
    }
}
