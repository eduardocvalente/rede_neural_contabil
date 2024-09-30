import { Router } from 'express';
import { inject, injectable } from 'inversify/lib/inversify';
import { ITrainingDataController } from '../controllers/interfaces/ITrainingDataController';

@injectable()
export class TrainingDataRoutes {
  private router: Router;

  constructor(
    @inject('ITrainingDataController')
    private trainingDataController: ITrainingDataController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/classify', (req, res) =>
      this.trainingDataController.classify(req, res),
    );
    this.router.post('/give-feedback', (req, res) =>
      this.trainingDataController.giveFeedback(req, res),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
