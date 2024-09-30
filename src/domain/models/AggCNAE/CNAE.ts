import { AutoMap } from '@automapper/classes';

export class CNAE {
  @AutoMap()
  public codigo: string;

  @AutoMap()
  public descricao: string;

  constructor(codigo: string, descricao: string) {
    this.codigo = codigo;
    this.descricao = descricao;
  }
}
