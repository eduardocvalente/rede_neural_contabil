import { AutoMap } from '@automapper/classes';

export class SimeiReceitaWSDTO {
    @AutoMap()
    public optante: boolean;

    @AutoMap()
    public dataOpcao: string | null;

    @AutoMap()
    public dataExclusao: string | null;

    @AutoMap()
    public ultimaAtualizacao: string;

    constructor(
        optante: boolean,               // Optante pelo Simei
        dataOpcao: string | null,       // Data de opção pelo Simei
        dataExclusao: string | null,    // Data de exclusão do Simei
        ultimaAtualizacao: string       // Data da última atualização
    ) {
        this.optante = optante;
        this.dataOpcao = dataOpcao;
        this.dataExclusao = dataExclusao;
        this.ultimaAtualizacao = ultimaAtualizacao;
    }
}
