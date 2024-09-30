import { AutoMap } from '@automapper/classes';
import { DetPagDTO } from "./DetPagDTO";

/* Conferido dia 03/09/2024 às 15:24 */
export class PagDTO {
    @AutoMap(() => DetPagDTO)
    detPag: DetPagDTO;

    constructor(detPag: DetPagDTO) {
        this.detPag = detPag;
    }
}
