import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 ás 15:23*/
export class CardDTO {
    @AutoMap()
    tpIntegra: string;

    @AutoMap()
    tBand: string;

    constructor(tpIntegra: string, tBand: string) {
        this.tpIntegra = tpIntegra;
        this.tBand = tBand;
    }
}
