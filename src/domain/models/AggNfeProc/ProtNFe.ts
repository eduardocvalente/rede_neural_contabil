import { AutoMap } from '@automapper/classes';
import { InfProt } from "./InfProt";

export class ProtNFe {
    @AutoMap()
    versao: string;

    @AutoMap()
    infProt: InfProt;

    constructor(versao: string, infProt: InfProt) {
        this.versao = versao;
        this.infProt = infProt;
    }
}
