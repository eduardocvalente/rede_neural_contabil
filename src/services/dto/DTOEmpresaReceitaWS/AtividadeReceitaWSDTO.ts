import { AutoMap } from '@automapper/classes';

export class AtividadeReceitaWSDTO {
  @AutoMap()
  public code: string; // Código da atividade
  @AutoMap()
  public text: string; // Descrição da atividade
  constructor(code: string, text: string) {
    this.code = code;
    this.text = text;
  }
}
