import { Request, Response } from 'express';

export interface ITrainingDataController {
  classify(req: Request, res: Response): void;
  giveFeedback(req: Request, res: Response): void;
}
