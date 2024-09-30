import { AutoMap } from '@automapper/classes';

export class AutXMLDTO {
    @AutoMap()
    CNPJ: string;

    constructor(CNPJ: string) {
        this.CNPJ = CNPJ;
    }
}
