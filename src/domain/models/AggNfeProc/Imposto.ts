import { AutoMap } from '@automapper/classes';
import { COFINS } from "./COFINS";
import { ICMS } from "./ICMS";
import { PIS } from "./PIS";

export class Imposto {
    @AutoMap()
    vTotTrib: string;

    @AutoMap(() => ICMS)
    ICMS: ICMS;

    @AutoMap(() => PIS)
    PIS: PIS;

    @AutoMap(() => COFINS)
    COFINS: COFINS;

    constructor(vTotTrib: string, ICMS: ICMS, PIS: PIS, COFINS: COFINS) {
        this.vTotTrib = vTotTrib;
        this.ICMS = ICMS;
        this.PIS = PIS;
        this.COFINS = COFINS;
    }
}
