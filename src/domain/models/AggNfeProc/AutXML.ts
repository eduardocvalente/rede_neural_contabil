import { AutoMap } from '@automapper/classes';

export class AutXML {
  @AutoMap()
  CNPJ: string;

  constructor(CNPJ: string) {
    this.CNPJ = CNPJ;
  }
}
