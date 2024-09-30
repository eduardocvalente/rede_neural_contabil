// src/services/implementations/FileUploadService.ts

import { IFileUploadService } from '../interfaces/IFileUploadService';
import { injectable } from 'inversify';
import { promises as fs } from 'fs';
import * as xml2js from 'xml2js';
import { Express } from 'express';

/**
 * Serviço responsável pelo processamento de uploads de arquivos XML.
 */
@injectable()
export class FileUploadService implements IFileUploadService {
  /**
   * Processa múltiplos arquivos XML, convertendo-os para JSON e removendo os arquivos após o processamento.
   * @param files Array de arquivos enviados via Multer.
   * @returns Promessa que resolve para um array de objetos JSON.
   */
  async processXmlFiles(files: Express.Multer.File[]): Promise<object[]> {
    const results: object[] = [];
    const parser = new xml2js.Parser({
      explicitArray: true, // Garante que NFe seja sempre um array
      mergeAttrs: true, // Mescla atributos com os elementos
      explicitRoot: false, // Remove o nó raiz
      ignoreAttrs: false, // Não ignora atributos
      trim: true, // Remove espaços em branco de strings
    });

    // Processamento paralelo usando Promise.all para melhorar a performance
    await Promise.all(
      files.map(async (file) => {
        const filePath = file.path; // Caminho do arquivo fornecido pelo Multer

        try {
          // Leitura assíncrona do arquivo
          const xmlData = await fs.readFile(filePath, 'utf8');

          // Parsing assíncrono do XML para JSON
          const result = await parser.parseStringPromise(xmlData);
          results.push(result);

          console.log(`Arquivo ${file.originalname} processado com sucesso.`);
        } catch (err) {
          console.error(
            `Erro ao processar o arquivo XML ${file.originalname}:`,
            err,
          );
          throw new Error(
            `Erro ao processar o arquivo XML ${file.originalname}.`,
          );
        } finally {
          try {
            // Remoção assíncrona do arquivo, garantindo que seja removido mesmo em caso de erro
            await fs.unlink(filePath);
            console.log(
              `Arquivo ${file.originalname} removido após processamento.`,
            );
          } catch (unlinkErr) {
            console.error(
              `Erro ao remover o arquivo ${file.originalname}:`,
              unlinkErr,
            );
          }
        }
      }),
    );

    return results;
  }
}
