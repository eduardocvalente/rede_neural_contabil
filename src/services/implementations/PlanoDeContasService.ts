import { IPlanoDeContasRepository } from '../../domain/models/AggPlanoDeContas/IPlanoDeContasRepository';
import { PlanoDeContas } from '../../domain/models/AggPlanoDeContas/PlanoDeContas';
import { IPlanoDeContasService } from '../../services/interfaces/IPlanoDeContasService';
import { PlanoDeContasFactory } from '../../domain/models/AggPlanoDeContas/PlanoDeContasFactory';
import { inject, injectable } from 'inversify/lib/inversify';

@injectable()
export class PlanoDeContasService implements IPlanoDeContasService {
  private repository: IPlanoDeContasRepository;

  constructor(
    @inject('IPlanoDeContasRepository') repository: IPlanoDeContasRepository,
  ) {
    this.repository = repository;
  }

  getAll(): PlanoDeContas[] {
    return this.repository.findAll();
  }

  getByCodigo(codigo: string): PlanoDeContas | null {
    return this.repository.findByCodigo(codigo);
  }

  createOrUpdate(
    codigo: string,
    descricao: string,
    nivel: number,
  ): PlanoDeContas | null {
    const planoDeContas = this.repository.findAll();

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

    const contaExistente = encontrarConta(planoDeContas, codigo);

    if (contaExistente) {
      contaExistente.descricao = descricao;
      contaExistente.nivel = nivel;
      this.repository.update(contaExistente);
      return contaExistente;
    }

    const codigoSuperior = codigo.split('.').slice(0, -1).join('.');
    if (nivel > 1 && !encontrarConta(planoDeContas, codigoSuperior)) {
      throw new Error(
        'A conta superior não existe. Adicione a conta superior primeiro.',
      );
    }

    function inserirConta(
      contas: PlanoDeContas[],
      novaConta: PlanoDeContas,
    ): boolean {
      if (nivel === 1) {
        contas.push(novaConta);
        return true;
      } else {
        for (let conta of contas) {
          if (conta.codigo === codigoSuperior) {
            conta.subcontas.push(novaConta);
            return true;
          }
          if (conta.subcontas && conta.subcontas.length > 0) {
            if (inserirConta(conta.subcontas, novaConta)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    const novaConta = PlanoDeContasFactory.create(codigo, descricao, nivel);

    if (inserirConta(planoDeContas, novaConta)) {
      this.repository.save(novaConta);
      return novaConta;
    } else {
      throw new Error(
        'Erro ao inserir a conta. Verifique a estrutura de dados.',
      );
    }
  }

  delete(codigo: string): void {
    const planoDeContas = this.repository.findAll();

    function removerConta(contas: PlanoDeContas[], codigo: string): boolean {
      for (let i = 0; i < contas.length; i++) {
        if (contas[i].codigo === codigo) {
          if (contas[i].subcontas && contas[i].subcontas.length > 0) {
            throw new Error(
              'Conta possui subcontas. Exclua as subcontas antes de excluir esta conta.',
            );
          }
          contas.splice(i, 1);
          return true;
        }
        if (contas[i].subcontas && contas[i].subcontas.length > 0) {
          if (removerConta(contas[i].subcontas, codigo)) {
            return true;
          }
        }
      }
      return false;
    }

    if (!removerConta(planoDeContas, codigo)) {
      throw new Error('Conta não encontrada.');
    }

    // Atualizar o repositório após a exclusão
    this.repository.saveAll(planoDeContas);
  }
}
