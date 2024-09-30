import { AutoMap } from '@automapper/classes';

export class CNAEDTO {
    @AutoMap()
    public codigo: string;

    @AutoMap()
    public descricao: string;

    constructor(codigo: string, descricao: string) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
}
