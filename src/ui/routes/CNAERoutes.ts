import { Router } from 'express';
import { inject, injectable } from 'inversify/lib/inversify';
import { ICNAEController } from '../controllers/interfaces/ICNAEController';

@injectable()
export class CNAERoutes {
  private router: Router;

  constructor(
    @inject('ICNAEController') private cnaeController: ICNAEController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/cnae', (req, res) =>
      this.cnaeController.getAllCNAE(req, res),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
