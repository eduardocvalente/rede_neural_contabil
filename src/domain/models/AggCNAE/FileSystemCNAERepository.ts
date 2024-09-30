import { injectable } from 'inversify';
import { ICNAERepository } from './ICNAERepository';
import { CNAE } from './CNAE';
import * as fs from 'fs';

@injectable()
export class FileSystemCNAERepository implements ICNAERepository {
  private readonly filePath = 'uploads/cnae.json';
  private cnaeData: CNAE[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      this.cnaeData = Array.isArray(data) ? data : [];
    }
  }

  findAll(): CNAE[] {
    return this.cnaeData;
  }
}
