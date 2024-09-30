import { AutoMap } from '@automapper/classes';
import { InfProtDTO } from "./InfProtDTO";

/*Conferido dia 03/09/2024 às 14:50*/
export class ProtNFeDTO {
    @AutoMap()
    versao: string;

    @AutoMap(() => InfProtDTO)
    infProt: InfProtDTO;

    constructor(versao: string, infProt: InfProtDTO) {
        this.versao = versao;
        this.infProt = infProt;
    }
}
