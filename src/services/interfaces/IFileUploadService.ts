// src/services/interfaces/IFileUploadService.ts

import { Express } from 'express';

export interface IFileUploadService {
  /**
   * Processa arquivos XML e retorna os dados convertidos para JSON.
   * @param files Array de arquivos enviados via Multer.
   * @returns Promessa que resolve para um array de objetos JSON.
   */
  processXmlFiles(files: Express.Multer.File[]): Promise<object[]>;
}
