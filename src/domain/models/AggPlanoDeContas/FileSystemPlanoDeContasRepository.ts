import { injectable } from 'inversify';
import { IPlanoDeContasRepository } from './IPlanoDeContasRepository';
import { PlanoDeContas } from './PlanoDeContas';
import * as fs from 'fs';

@injectable()
export class FileSystemPlanoDeContasRepository
  implements IPlanoDeContasRepository
{
  private readonly filePath = 'uploads/planoDeContas.json';
  private planoDeContas: PlanoDeContas[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      this.planoDeContas = Array.isArray(data)
        ? data
        : data.PlanoDeContas || [];
    }
  }

  private saveToFile() {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify({ PlanoDeContas: this.planoDeContas }, null, 2),
    );
  }

  findAll(): PlanoDeContas[] {
    return this.planoDeContas;
  }

  findByCodigo(codigo: string): PlanoDeContas | null {
    function encontrarConta(
      contas: PlanoDeContas[],
      codigo: string,
    ): PlanoDeContas | null {
      for (let conta of contas) {
        if (conta.codigo === codigo) {
          return conta;
        }
        if (conta.subcontas && conta.subcontas.length > 0) {
          const result = encontrarConta(conta.subcontas, codigo);
          if (result) {
            return result;
          }
        }
      }
      return null;
    }

    return encontrarConta(this.planoDeContas, codigo);
  }

  save(planoDeContas: PlanoDeContas): void {
    this.planoDeContas.push(planoDeContas);
    this.saveToFile();
  }

  update(planoDeContas: PlanoDeContas): void {
    const contaExistente = this.findByCodigo(planoDeContas.codigo);
    if (contaExistente) {
      Object.assign(contaExistente, planoDeContas);
      this.saveToFile();
    }
  }

  delete(codigo: string): void {
    function removerConta(contas: PlanoDeContas[], codigo: string): boolean {
      for (let i = 0; i < contas.length; i++) {
        if (contas[i].codigo === codigo) {
          if (contas[i].subcontas.length > 0) {
            throw new Error(
              'Conta possui subcontas. Exclua as subcontas antes de excluir esta conta.',
            );
          }
          contas.splice(i, 1);
          return true;
        }
        if (removerConta(contas[i].subcontas, codigo)) {
          return true;
        }
      }
      return false;
    }

    if (removerConta(this.planoDeContas, codigo)) {
      this.saveToFile();
    } else {
      throw new Error('Conta não encontrada.');
    }
  }

  saveAll(planoDeContas: PlanoDeContas[]): void {
    this.planoDeContas = planoDeContas;
    this.saveToFile();
  }
}
