import { AutoMap } from '@automapper/classes';
import { COFINSDTO } from "./COFINSDTO";
import { ICMSDTO } from "./ICMSDTO";
import { PISDTO } from "./PISDTO";

export class ImpostoDTO {
    @AutoMap()
    vTotTrib: string;

    @AutoMap(() => ICMSDTO)
    ICMS: ICMSDTO;

    @AutoMap(() => PISDTO)
    PIS: PISDTO;

    @AutoMap(() => COFINSDTO)
    COFINS: COFINSDTO;

    constructor(vTotTrib: string, ICMS: ICMSDTO, PIS: PISDTO, COFINS: COFINSDTO) {
        this.vTotTrib = vTotTrib;
        this.ICMS = ICMS;
        this.PIS = PIS;
        this.COFINS = COFINS;
    }
}
