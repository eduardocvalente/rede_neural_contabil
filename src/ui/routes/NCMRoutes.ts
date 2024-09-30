import { Router } from 'express';
import { inject, injectable } from 'inversify/lib/inversify';
import { INCMController } from '../controllers/interfaces/INCMController';

@injectable()
export class NCMRoutes {
  private router: Router;

  constructor(@inject('INCMController') private ncmController: INCMController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/ncm', (req, res) =>
      this.ncmController.getAllNCM(req, res),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
