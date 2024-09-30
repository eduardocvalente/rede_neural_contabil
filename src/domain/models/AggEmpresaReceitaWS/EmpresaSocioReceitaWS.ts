import { AutoMap } from '@automapper/classes';

export class EmpresaSocioReceitaWS {
    @AutoMap()
    public nome: string;

    @AutoMap()
    public cnpjCpf: string;

    @AutoMap()
    public qualificacao: string;

    @AutoMap()
    public faixaEtaria: string;

    @AutoMap()
    public dataEntrada: string;

    @AutoMap()
    public identificador: number;

    @AutoMap()
    public cpfRepresentante?: string;

    @AutoMap()
    public nomeRepresentante?: string;

    @AutoMap()
    public qualificacaoRepresentante?: string;

    constructor(
        nome: string,
        cnpjCpf: string,
        qualificacao: string,
        faixaEtaria: string,
        dataEntrada: string,
        identificador: number,
        cpfRepresentante?: string,
        nomeRepresentante?: string,
        qualificacaoRepresentante?: string
    ) {
        this.nome = nome;
        this.cnpjCpf = cnpjCpf;
        this.qualificacao = qualificacao;
        this.faixaEtaria = faixaEtaria;
        this.dataEntrada = dataEntrada;
        this.identificador = identificador;
        this.cpfRepresentante = cpfRepresentante;
        this.nomeRepresentante = nomeRepresentante;
        this.qualificacaoRepresentante = qualificacaoRepresentante;
    }
}
