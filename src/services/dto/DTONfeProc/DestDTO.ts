import { AutoMap } from '@automapper/classes';
import { EnderDestDTO } from './EnderDestDTO';

export class DestDTO {
  @AutoMap()
  public CNPJ: string; // CNPJ do destinatário

  @AutoMap()
  public xNome: string; // Nome do destinatário

  @AutoMap(() => EnderDestDTO)
  public enderDest: EnderDestDTO; // Endereço do destinatário

  @AutoMap()
  public indIEDest: string; // Indicador de Inscrição Estadual

  @AutoMap()
  public email: string; // Email do destinatário

  constructor(
    CNPJ: string,
    xNome: string,
    enderDest: EnderDestDTO,
    indIEDest: string,
    email: string,
  ) {
    this.CNPJ = CNPJ;
    this.xNome = xNome;
    this.enderDest = enderDest;
    this.indIEDest = indIEDest;
    this.email = email;
  }
}
