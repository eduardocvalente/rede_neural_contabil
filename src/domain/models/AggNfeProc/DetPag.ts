import { AutoMap } from '@automapper/classes';
import { Card } from "./Card";

/*Conferido dia 03/09/2024 ás 15:24*/
export class DetPag {
    @AutoMap()
    indPag: string;

    @AutoMap()
    tPag: string;

    @AutoMap()
    vPag: string;

    @AutoMap(() => Card)
    card: Card;

    constructor(indPag: string, tPag: string, vPag: string, card: Card) {
        this.indPag = indPag;
        this.tPag = tPag;
        this.vPag = vPag;
        this.card = card;
    }

}
