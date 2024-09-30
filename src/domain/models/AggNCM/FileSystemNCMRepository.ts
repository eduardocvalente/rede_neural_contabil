import { injectable } from 'inversify';
import { INCMRepository } from './INCMRepository';
import { NCM } from './NCM';
import * as fs from 'fs';

@injectable()
export class FileSystemNCMRepository implements INCMRepository {
  private readonly filePath = 'uploads/Tabela_NCM_Vigente_20240407.json';
  private ncmData: NCM[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

      // Verifica se a chave 'Nomenclaturas' existe e é uma matriz
      if (data && Array.isArray(data.Nomenclaturas)) {
        this.ncmData = data.Nomenclaturas.map((item: any) => {
          return new NCM(item.Codigo, item.Descricao);
        });
      } else {
        console.error('Estrutura de dados inválida no arquivo NCM.');
      }
    } else {
      console.error(`Arquivo não encontrado: ${this.filePath}`);
    }
  }

  findAll(): NCM[] {
    return this.ncmData;
  }
}
