import { AutoMap } from '@automapper/classes';

export class InfRespTec {
    @AutoMap()
    CNPJ: string;

    @AutoMap()
    xContato: string;

    @AutoMap()
    email: string;

    @AutoMap()
    fone: string;

    constructor(CNPJ: string, xContato: string, email: string, fone: string) {
        this.CNPJ = CNPJ;
        this.xContato = xContato;
        this.email = email;
        this.fone = fone;
    }
}
