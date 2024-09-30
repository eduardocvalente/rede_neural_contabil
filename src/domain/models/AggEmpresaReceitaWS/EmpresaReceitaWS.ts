import { AutoMap } from '@automapper/classes';
import { AtividadeReceitaWS } from "./AtividadeReceitaWS";
import { SocioReceitaWS } from "./SocioReceitaWS";
import { SimplesReceitaWS } from "./SimplesReceitaWS";
import { SimeiReceitaWS } from "./SimeiReceitaWS";

export class EmpresaReceitaWS {
    @AutoMap()
    public abertura: string;

    @AutoMap()
    public situacao: string;

    @AutoMap()
    public tipo: string;

    @AutoMap()
    public nome: string;

    @AutoMap()
    public fantasia: string;

    @AutoMap()
    public porte: string;

    @AutoMap()
    public naturezaJuridica: string;

    @AutoMap(() => [AtividadeReceitaWS])
    public atividadesPrincipais: AtividadeReceitaWS[];

    @AutoMap(() => [AtividadeReceitaWS])
    public atividadesSecundarias: AtividadeReceitaWS[];

    @AutoMap(() => [SocioReceitaWS])
    public socios: SocioReceitaWS[];

    @AutoMap()
    public logradouro: string;

    @AutoMap()
    public numero: string;

    @AutoMap()
    public complemento: string;

    @AutoMap()
    public bairro: string;

    @AutoMap()
    public municipio: string;

    @AutoMap()
    public uf: string;

    @AutoMap()
    public cep: string;

    @AutoMap()
    public email: string;

    @AutoMap()
    public telefone: string;

    @AutoMap()
    public cnpj: string;

    @AutoMap()
    public capitalSocial: string;

    @AutoMap()
    public simples: SimplesReceitaWS;

    @AutoMap()
    public simei: SimeiReceitaWS;
    
    constructor(
        abertura: string,
        situacao: string,
        tipo: string,
        nome: string,
        fantasia: string,
        porte: string,
        naturezaJuridica: string,
        atividadesPrincipais: AtividadeReceitaWS[],
        atividadesSecundarias: AtividadeReceitaWS[],
        socios: SocioReceitaWS[],
        logradouro: string,
        numero: string,
        complemento: string,
        bairro: string,
        municipio: string,
        uf: string,
        cep: string,
        email: string,
        telefone: string,
        cnpj: string,
        capitalSocial: string,
        simples: SimplesReceitaWS,
        simei: SimeiReceitaWS
    ) {
        this.abertura = abertura;
        this.situacao = situacao;
        this.tipo = tipo;
        this.nome = nome;
        this.fantasia = fantasia;
        this.porte = porte;
        this.naturezaJuridica = naturezaJuridica;
        this.atividadesPrincipais = atividadesPrincipais;
        this.atividadesSecundarias = atividadesSecundarias;
        this.socios = socios;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.municipio = municipio;
        this.uf = uf;
        this.cep = cep;
        this.email = email;
        this.telefone = telefone;
        this.cnpj = cnpj;
        this.capitalSocial = capitalSocial;
        this.simples = simples;
        this.simei = simei;
    }
}
