import { KeyInfoFactory } from './KeyInfoFactory';
import { Signature } from './Signature';
import { SignedInfoFactory } from './SignedInfoFactory';

export class SignatureFactory {
  static create(json: any): Signature {
    return new Signature(
      json.xmlns[0],
      SignedInfoFactory.create(json.SignedInfo[0]),
      json.SignatureValue[0],
      KeyInfoFactory.create(json.KeyInfo[0]),
    );
  }
}
