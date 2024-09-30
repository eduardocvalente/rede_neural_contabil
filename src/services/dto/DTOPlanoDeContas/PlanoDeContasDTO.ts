import { AutoMap } from '@automapper/classes';

export class PlanoDeContasDTO {
    @AutoMap()
    codigo: string;

    @AutoMap()
    descricao: string;

    @AutoMap()
    nivel: number;

    @AutoMap(() => [PlanoDeContasDTO])
    subcontas: PlanoDeContasDTO[] = [];

    constructor(codigo: string, descricao: string, nivel: number) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.nivel = nivel;
    }
}
