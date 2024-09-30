import { AutXML } from './AutXML';

export class AutXMLFactory {
  static create(json: any): AutXML {
    return new AutXML(
      json.CNPJ?.[0] || '', // Verifica se json.CNPJ existe e se é um array, retorna string vazia se não existir
    );
  }
}
