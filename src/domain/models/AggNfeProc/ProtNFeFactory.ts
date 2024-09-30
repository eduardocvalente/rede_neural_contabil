import { InfProtFactory } from './InfProtFactory';
import { ProtNFe } from './ProtNFe';

export class ProtNFeFactory {
  static create(json: any): ProtNFe {
    return new ProtNFe(json.versao, InfProtFactory.create(json.infProt[0]));
  }
}
