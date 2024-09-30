import { AutoMap } from '@automapper/classes';

export class NCMDTO {
    @AutoMap()
    public codigo: string;   // Código do NCM
    
    @AutoMap()
    public descricao: string;  // Descrição do NCM

    constructor(codigo: string, descricao: string) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
}
