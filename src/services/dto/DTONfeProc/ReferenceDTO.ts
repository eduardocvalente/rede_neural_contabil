import { AutoMap } from '@automapper/classes';
import { DigestMethodDTO } from "./DigestMethodDTO";
import { TransformDTO } from "./TransformDTO";

/*Conferido dia 03/09/2024 às 15:36*/
export class ReferenceDTO {
    @AutoMap()
    URI: string;

    @AutoMap(() => [TransformDTO])
    Transforms: TransformDTO[];

    @AutoMap(() => DigestMethodDTO)
    DigestMethod: DigestMethodDTO;

    @AutoMap()
    DigestValue: string;

    constructor(URI: string, Transforms: TransformDTO[], DigestMethod: DigestMethodDTO, DigestValue: string) {
        this.URI = URI;
        this.Transforms = Transforms;
        this.DigestMethod = DigestMethod;
        this.DigestValue = DigestValue;
    }
}
