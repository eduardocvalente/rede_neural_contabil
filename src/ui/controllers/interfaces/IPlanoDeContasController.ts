import { Request, Response } from 'express';

export interface IPlanoDeContasController {
  getAll(req: Request, res: Response): void;
  getByCodigo(req: Request, res: Response): void;
  createOrUpdate(req: Request, res: Response): void;
  delete(req: Request, res: Response): void;
}
