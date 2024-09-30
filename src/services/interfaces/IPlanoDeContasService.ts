import { PlanoDeContas } from '../../domain/models/AggPlanoDeContas/PlanoDeContas';

export interface IPlanoDeContasService {
  getAll(): PlanoDeContas[];
  getByCodigo(codigo: string): PlanoDeContas | null;
  createOrUpdate(codigo: string, descricao: string, nivel: number): void;
  delete(codigo: string): void;
}
