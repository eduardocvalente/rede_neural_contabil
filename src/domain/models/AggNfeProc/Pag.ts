import { AutoMap } from '@automapper/classes';
import { DetPag } from "./DetPag";

/*Conferido dia 03/09/2024 às 15:24*/
export class Pag {
    @AutoMap(() => DetPag)
    detPag: DetPag;

    constructor(detPag: DetPag) {
        this.detPag = detPag;
    }
}
