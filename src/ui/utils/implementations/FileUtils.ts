import fs from 'fs';
import { IFileUtils } from '../interfaces/IFileUtils';

export class FileUtils implements IFileUtils {
  fileExists(path: string): boolean {
    return fs.existsSync(path);
  }

  readFileAsJson(path: string): any {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  }

  writeJsonToFile(path: string, data: any): void {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(path, jsonData, 'utf8');
  }
}
