import { AutoMap } from '@automapper/classes';

export class TransformDTO {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
