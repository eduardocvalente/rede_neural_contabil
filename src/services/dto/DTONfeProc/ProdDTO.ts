import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:08*/
export class ProdDTO {
  @AutoMap()
  cProd: string;

  @AutoMap()
  cEAN: string;

  @AutoMap()
  xProd: string;

  @AutoMap()
  NCM: string;

  @AutoMap()
  CEST: string;

  @AutoMap()
  CFOP: string;

  @AutoMap()
  uCom: string;

  @AutoMap()
  qCom: string;

  @AutoMap()
  vUnCom: string;

  @AutoMap()
  vProd: string;

  @AutoMap()
  cEANTrib: string;

  @AutoMap()
  uTrib: string;

  @AutoMap()
  qTrib: string;

  @AutoMap()
  vUnTrib: string;

  @AutoMap()
  indTot: string;

  @AutoMap()
  nItemPed: string;

  constructor(
    cProd: string,
    cEAN: string,
    xProd: string,
    NCM: string,
    CEST: string,
    CFOP: string,
    uCom: string,
    qCom: string,
    vUnCom: string,
    vProd: string,
    cEANTrib: string,
    uTrib: string,
    qTrib: string,
    vUnTrib: string,
    indTot: string,
    nItemPed: string,
  ) {
    this.cProd = cProd;
    this.cEAN = cEAN;
    this.xProd = xProd;
    this.NCM = NCM;
    this.CEST = CEST;
    this.CFOP = CFOP;
    this.uCom = uCom;
    this.qCom = qCom;
    this.vUnCom = vUnCom;
    this.vProd = vProd;
    this.cEANTrib = cEANTrib;
    this.uTrib = uTrib;
    this.qTrib = qTrib;
    this.vUnTrib = vUnTrib;
    this.indTot = indTot;
    this.nItemPed = nItemPed;
  }
}
