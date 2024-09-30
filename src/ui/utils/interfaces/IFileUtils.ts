export interface IFileUtils {
  fileExists(path: string): boolean;
  readFileAsJson(path: string): any;
  writeJsonToFile(path: string, data: any): void;
}
