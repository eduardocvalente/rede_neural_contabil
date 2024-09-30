import { AutoMap } from '@automapper/classes';
import { CanonicalizationMethodDTO } from "./CanonicalizationMethodDTO";
import { ReferenceDTO } from "./ReferenceDTO";
import { SignatureMethodDTO } from "./SignatureMethodDTO";

/*Conferido dia 03/09/2024 às 15:32*/
export class SignedInfoDTO {
    @AutoMap(() => CanonicalizationMethodDTO)
    CanonicalizationMethod: CanonicalizationMethodDTO;

    @AutoMap(() => SignatureMethodDTO)
    SignatureMethod: SignatureMethodDTO;

    @AutoMap(() => ReferenceDTO)
    Reference: ReferenceDTO;

    constructor(CanonicalizationMethod: CanonicalizationMethodDTO, SignatureMethod: SignatureMethodDTO, Reference: ReferenceDTO) {
        this.CanonicalizationMethod = CanonicalizationMethod;
        this.SignatureMethod = SignatureMethod;
        this.Reference = Reference;
    }
}
