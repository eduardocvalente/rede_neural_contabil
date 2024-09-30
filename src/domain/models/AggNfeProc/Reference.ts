import { AutoMap } from '@automapper/classes';
import { DigestMethod } from "./DigestMethod";
import { Transform } from "./Transform";

export class Reference {
    @AutoMap()
    URI: string;

    @AutoMap(() => [Transform]) // Supondo que Transform seja um array de objetos
    Transforms: Transform[];

    @AutoMap()
    DigestMethod: DigestMethod;

    @AutoMap()
    DigestValue: string;

    constructor(URI: string, Transforms: Transform[], DigestMethod: DigestMethod, DigestValue: string) {
        this.URI = URI;
        this.Transforms = Transforms;
        this.DigestMethod = DigestMethod;
        this.DigestValue = DigestValue;
    }
}
