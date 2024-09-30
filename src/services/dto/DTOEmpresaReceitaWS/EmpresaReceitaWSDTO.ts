import { AutoMap } from '@automapper/classes';
import { AtividadeReceitaWSDTO } from './AtividadeReceitaWSDTO';
import { SocioReceitaWSDTO } from './SocioReceitaWSDTO';
import { SimplesReceitaWSDTO } from './SimplesReceitaWSDTO';
import { SimeiReceitaWSDTO } from './SimeiReceitaWSDTO';

export class EmpresaReceitaWSDTO {
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

  @AutoMap(() => [AtividadeReceitaWSDTO])
  public atividadesPrincipais: AtividadeReceitaWSDTO[];

  @AutoMap(() => [AtividadeReceitaWSDTO])
  public atividadesSecundarias: AtividadeReceitaWSDTO[];

  @AutoMap(() => [SocioReceitaWSDTO])
  public socios: SocioReceitaWSDTO[];

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
  public simples: SimplesReceitaWSDTO;

  @AutoMap()
  public simei: SimeiReceitaWSDTO;

  constructor(
    abertura: string,
    situacao: string,
    tipo: string,
    nome: string,
    fantasia: string,
    porte: string,
    naturezaJuridica: string,
    atividadesPrincipais: AtividadeReceitaWSDTO[],
    atividadesSecundarias: AtividadeReceitaWSDTO[],
    socios: SocioReceitaWSDTO[],
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
    simples: SimplesReceitaWSDTO,
    simei: SimeiReceitaWSDTO,
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
