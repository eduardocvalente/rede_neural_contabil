import { AutoMap } from '@automapper/classes';

export class PlanoDeContas {
  @AutoMap()
  public codigo: string;

  @AutoMap()
  public descricao: string;

  @AutoMap()
  public nivel: number;

  @AutoMap(() => [PlanoDeContas])
  public subcontas: PlanoDeContas[] = [];

  constructor(codigo: string, descricao: string, nivel: number) {
    this.codigo = codigo;
    this.descricao = descricao;
    this.nivel = nivel;
  }
}
