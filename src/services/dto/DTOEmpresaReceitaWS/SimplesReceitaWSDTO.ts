import { AutoMap } from '@automapper/classes';

export class SimplesReceitaWSDTO {
    @AutoMap()
    public optante: boolean;

    @AutoMap()
    public dataOpcao: string;

    @AutoMap()
    public dataExclusao: string;

    @AutoMap()
    public ultimaAtualizacao: string;

    constructor(
        optante: boolean,               // Optante pelo Simples Nacional
        dataOpcao: string,              // Data de opção pelo Simples Nacional
        dataExclusao: string,           // Data de exclusão do Simples Nacional
        ultimaAtualizacao: string       // Data da última atualização
    ) {
        this.optante = optante;
        this.dataOpcao = dataOpcao;
        this.dataExclusao = dataExclusao;
        this.ultimaAtualizacao = ultimaAtualizacao;
    }
}
