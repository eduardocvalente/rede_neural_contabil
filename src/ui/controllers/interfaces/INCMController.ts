import { Request, Response } from 'express';

export interface INCMController {
  getAllNCM(req: Request, res: Response): void;
}
