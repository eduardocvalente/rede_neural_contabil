import { NFeFactory } from './NFeFactory';
import { NfeProc } from './NfeProc';
import { ProtNFeFactory } from './ProtNFeFactory';

export class NfeProcFactory {
  static create(json: any): NfeProc {
    return new NfeProc(
      json?.$?.xmlns || '', // Verifica se existe a propriedade xmlns, caso contrário, usa string vazia
      json?.$?.versao || '', // Verifica se existe a propriedade versao, caso contrário, usa string vazia
      json?.NFe?.map((nfe: any) => NFeFactory.create(nfe)) || [], // Verifica se NFe existe e mapeia, ou retorna array vazio
      json?.protNFe?.map((prot: any) => ProtNFeFactory.create(prot)) || [], // Verifica se protNFe existe e mapeia, ou retorna array vazio
    );
  }
}
