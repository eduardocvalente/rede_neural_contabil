/* Conferido dia 03/09/2024 às 15:24 */
import { AutoMap } from '@automapper/classes';
import { CardDTO } from "./CardDTO";

export class DetPagDTO {
    @AutoMap()
    public indPag: string;

    @AutoMap()
    public tPag: string;

    @AutoMap()
    public vPag: string;

    @AutoMap(() => CardDTO)
    public card: CardDTO;

    constructor(indPag: string, tPag: string, vPag: string, card: CardDTO) {
        this.indPag = indPag;
        this.tPag = tPag;
        this.vPag = vPag;
        this.card = card;
    }
}
