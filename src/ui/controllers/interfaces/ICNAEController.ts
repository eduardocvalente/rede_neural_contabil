import { Request, Response } from 'express';

export interface ICNAEController {
  getAllCNAE(req: Request, res: Response): void;
}
