import { Request, Response } from 'express';

export interface IFileUploadController {
  uploadXmlFiles(req: Request, res: Response): Promise<void>;
}
