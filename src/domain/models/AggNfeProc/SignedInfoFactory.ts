import { ReferenceFactory } from './ReferenceFactory';
import { SignedInfo } from './SignedInfo';

export class SignedInfoFactory {
  static create(json: any): SignedInfo {
    return new SignedInfo(
      json?.CanonicalizationMethod?.[0]?.Algorithm || '', // Verifica se CanonicalizationMethod e seu algoritmo existem
      json?.SignatureMethod?.[0]?.Algorithm || '', // Verifica se SignatureMethod e seu algoritmo existem
      json?.Reference
        ? json.Reference.map((ref: any) => ReferenceFactory.create(ref))
        : [], // Verifica se Reference existe e mapeia, ou retorna array vazio
    );
  }
}
