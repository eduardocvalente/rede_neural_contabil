/*Conferido dia 03/09/2024 às 15:39*/
import { AutoMap } from '@automapper/classes';
import { InfNFeDTO } from './InfNFeDTO';
import { InfNFeSuplDTO } from './InfNFeSuplDTO';
import { SignatureDTO } from './SignatureDTO';

export class NFeDTO {
  @AutoMap()
  xmlns: string;

  @AutoMap(() => [InfNFeDTO])
  infNFe: InfNFeDTO[];

  @AutoMap()
  infNFeSupl: InfNFeSuplDTO;

  @AutoMap()
  Signature: SignatureDTO;

  constructor(
    xmlns: string,
    infNFe: InfNFeDTO[],
    infNFeSupl: InfNFeSuplDTO,
    Signature: SignatureDTO,
  ) {
    this.xmlns = xmlns;
    this.infNFe = infNFe;
    this.infNFeSupl = infNFeSupl;
    this.Signature = Signature;
  }
}
