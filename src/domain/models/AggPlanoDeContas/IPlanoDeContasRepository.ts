import { PlanoDeContas } from './PlanoDeContas';

export interface IPlanoDeContasRepository {
  findAll(): PlanoDeContas[];
  findByCodigo(codigo: string): PlanoDeContas | null;
  save(planoDeContas: PlanoDeContas): void;
  update(planoDeContas: PlanoDeContas): void;
  delete(codigo: string): void;
  saveAll(planoDeContas: PlanoDeContas[]): void;
}
