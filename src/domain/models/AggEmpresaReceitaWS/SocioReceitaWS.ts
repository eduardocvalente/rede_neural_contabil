import { AutoMap } from '@automapper/classes';

export class SocioReceitaWS {
    @AutoMap()
    public nome: string;

    @AutoMap()
    public qualificacao: string;

    @AutoMap()
    public nomeRepresentanteLegal?: string;

    @AutoMap()
    public qualificacaoRepresentanteLegal?: string;

    constructor(
        nome: string,                      // Nome do sócio
        qualificacao: string,              // Qualificação do sócio
        nomeRepresentanteLegal?: string,   // Nome do representante legal (opcional)
        qualificacaoRepresentanteLegal?: string  // Qualificação do representante legal (opcional)
    ) {
        this.nome = nome;
        this.qualificacao = qualificacao;
        this.nomeRepresentanteLegal = nomeRepresentanteLegal;
        this.qualificacaoRepresentanteLegal = qualificacaoRepresentanteLegal;
    }
}
