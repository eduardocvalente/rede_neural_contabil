import { AutoMap } from '@automapper/classes';
import { CanonicalizationMethod } from "./CanonicalizationMethod";
import { Reference } from "./Reference";
import { SignatureMethod } from "./SignatureMethod";

export class SignedInfo {
    @AutoMap()
    CanonicalizationMethod: CanonicalizationMethod;

    @AutoMap()
    SignatureMethod: SignatureMethod;

    @AutoMap()
    Reference: Reference;

    constructor(
        CanonicalizationMethod: CanonicalizationMethod, 
        SignatureMethod: SignatureMethod, 
        Reference: Reference
    ) {
        this.CanonicalizationMethod = CanonicalizationMethod;
        this.SignatureMethod = SignatureMethod;
        this.Reference = Reference;
    }
}
