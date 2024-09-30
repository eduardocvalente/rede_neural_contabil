import { AutoMap } from '@automapper/classes';
import { NFe } from './NFe';
import { ProtNFe } from './ProtNFe';

/*Conferido dia 03/09/2024 às 15:42*/
export class NfeProc {
  @AutoMap()
  xmlns: string;

  @AutoMap()
  versao: string;

  @AutoMap(() => [NFe])
  NFe: NFe[];

  @AutoMap(() => [ProtNFe])
  protNFe: ProtNFe[];

  constructor(xmlns: string, versao: string, NFe: NFe[], protNFe: ProtNFe[]) {
    this.xmlns = xmlns;
    this.versao = versao;
    this.NFe = NFe;
    this.protNFe = protNFe;
  }
}
