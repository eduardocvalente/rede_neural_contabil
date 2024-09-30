import { PlanoDeContas } from './PlanoDeContas';

export class PlanoDeContasFactory {
  static create(
    codigo: string,
    descricao: string,
    nivel: number,
  ): PlanoDeContas {
    return new PlanoDeContas(codigo, descricao, nivel);
  }
}
