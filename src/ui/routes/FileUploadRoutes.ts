import { Router } from 'express';
import { inject, injectable } from 'inversify/lib/inversify';
import { IFileUploadController } from '../controllers/interfaces/IFileUploadController';
import multer from 'multer';

@injectable()
export class FileUploadRoutes {
  private router: Router;
  private upload: multer.Multer;

  constructor(
    @inject('IFileUploadController')
    private fileUploadController: IFileUploadController,
  ) {
    this.router = Router();
    this.upload = multer({ dest: 'uploads/' }); // Configuração do multer para upload
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/upload-xml', this.upload.array('xmlFiles'), (req, res) =>
      this.fileUploadController.uploadXmlFiles(req, res),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
