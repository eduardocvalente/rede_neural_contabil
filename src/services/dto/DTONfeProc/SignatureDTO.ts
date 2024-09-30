import { AutoMap } from '@automapper/classes';
import { KeyInfoDTO } from "./KeyInfoDTO";
import { SignedInfoDTO } from "./SignedInfoDTO";

/*Conferido dia 03/09/2024 às 15:39*/
export class SignatureDTO {
    @AutoMap()
    xmlns: string;

    @AutoMap(() => SignedInfoDTO)
    SignedInfo: SignedInfoDTO;

    @AutoMap()
    SignatureValue: string;

    @AutoMap(() => KeyInfoDTO)
    KeyInfo: KeyInfoDTO;

    constructor(xmlns: string, SignedInfo: SignedInfoDTO, SignatureValue: string, KeyInfo: KeyInfoDTO) {
        this.xmlns = xmlns;
        this.SignedInfo = SignedInfo;
        this.SignatureValue = SignatureValue;
        this.KeyInfo = KeyInfo;
    }
}
