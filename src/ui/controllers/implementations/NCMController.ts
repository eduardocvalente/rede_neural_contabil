import { inject, injectable } from 'inversify/lib/inversify';
import { INCMService } from '../../../services/interfaces/INCMService';
import { INCMController } from '../interfaces/INCMController';
import { Request, Response } from 'express';

@injectable()
export class NCMController implements INCMController {
  private ncmService: INCMService;

  constructor(@inject('INCMService') ncmService: INCMService) {
    this.ncmService = ncmService;
  }

  getAllNCM(req: Request, res: Response): void {
    const ncms = this.ncmService.getAllNCM();
    res.json(ncms);
  }
}
