import { AutoMap } from '@automapper/classes';
import { KeyInfo } from "./KeyInfo";
import { SignedInfo } from "./SignedInfo";

export class Signature {
    @AutoMap()
    xmlns: string;

    @AutoMap(() => SignedInfo) // Supondo que SignedInfo seja uma classe
    SignedInfo: SignedInfo;

    @AutoMap()
    SignatureValue: string;

    @AutoMap(() => KeyInfo) // Supondo que KeyInfo seja uma classe
    KeyInfo: KeyInfo;

    constructor(xmlns: string, SignedInfo: SignedInfo, SignatureValue: string, KeyInfo: KeyInfo) {
        this.xmlns = xmlns;
        this.SignedInfo = SignedInfo;
        this.SignatureValue = SignatureValue;
        this.KeyInfo = KeyInfo;
    }
}
