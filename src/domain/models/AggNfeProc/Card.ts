import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 ás 15:23*/
export class Card {
    @AutoMap()
    tpIntegra: string;

    @AutoMap()
    tBand: string;

    constructor(tpIntegra: string, tBand: string) {
        this.tpIntegra = tpIntegra;
        this.tBand = tBand;
    }

    static factory(json: any): Card {
        return new Card(json.tpIntegra[0], json.tBand[0]);
    }
}
