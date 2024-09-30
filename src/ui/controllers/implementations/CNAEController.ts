import { inject, injectable } from 'inversify/lib/inversify';
import { ICNAEService } from '../../../services/interfaces/ICNAEService';
import { ICNAEController } from '../interfaces/ICNAEController';
import { Request, Response } from 'express';

@injectable()
export class CNAEController implements ICNAEController {
  constructor(@inject('ICNAEService') private cnaeService: ICNAEService) {}

  getAllCNAE(req: Request, res: Response): void {
    const cnaes = this.cnaeService.getAllCNAE();

    res.json(cnaes);
  }
}
