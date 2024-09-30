import { inject, injectable } from 'inversify/lib/inversify';
import { Request, Response } from 'express';
import { IPlanoDeContasService } from '../../../services/interfaces/IPlanoDeContasService';
import { IPlanoDeContasController } from '../interfaces/IPlanoDeContasController';

@injectable()
export class PlanoDeContasController implements IPlanoDeContasController {
  private service: IPlanoDeContasService;

  constructor(@inject('IPlanoDeContasService') service: IPlanoDeContasService) {
    this.service = service;
  }

  getAll(req: Request, res: Response): void {
    const contas = this.service.getAll();
    res.json(contas);
  }

  getByCodigo(req: Request, res: Response): void {
    const codigo = req.params.codigo;
    const conta = this.service.getByCodigo(codigo);
    if (conta) {
      res.json(conta);
    } else {
      res.status(404).json({ error: 'Conta não encontrada' });
    }
  }

  createOrUpdate(req: Request, res: Response): void {
    const { codigo, descricao, nivel } = req.body;
    if (!codigo || !descricao || !nivel) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      return;
    }
    try {
      const conta = this.service.createOrUpdate(codigo, descricao, nivel);
      res
        .status(201)
        .json({ message: 'Conta criada ou atualizada com sucesso', conta });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  delete(req: Request, res: Response): void {
    const codigo = req.params.codigo;
    try {
      this.service.delete(codigo);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
