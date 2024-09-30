import { AutoMap } from '@automapper/classes';

export class EmpresaCNAESecundarioReceitaWSDTO {
    @AutoMap()
    public codigo: number;

    @AutoMap()
    public descricao: string;

    constructor(codigo: number, descricao: string) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
}
