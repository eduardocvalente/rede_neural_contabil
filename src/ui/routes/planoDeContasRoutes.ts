import { Router } from 'express';
import { inject, injectable } from 'inversify/lib/inversify'; // Certifique-se de importar 'injectable'
import { IPlanoDeContasController } from '../controllers/interfaces/IPlanoDeContasController';

@injectable() // Decorador 'injectable' para permitir que a classe seja injetada
export class PlanoDeContasRoutes {
  constructor(
    @inject('IPlanoDeContasController')
    private controller: IPlanoDeContasController,
  ) {}

  public getRouter(): Router {
    const router = Router(); // Declare o router aqui para evitar problemas

    router.get('/plano-de-contas', (req, res) =>
      this.controller.getAll(req, res),
    );
    router.get('/plano-de-contas/:codigo', (req, res) =>
      this.controller.getByCodigo(req, res),
    );
    router.post('/plano-de-contas', (req, res) =>
      this.controller.createOrUpdate(req, res),
    );
    router.put('/plano-de-contas/:codigo', (req, res) =>
      this.controller.createOrUpdate(req, res),
    );
    router.delete('/plano-de-contas/:codigo', (req, res) =>
      this.controller.delete(req, res),
    );

    return router;
  }
}
