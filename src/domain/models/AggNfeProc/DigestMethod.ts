import { AutoMap } from '@automapper/classes';

export class DigestMethod {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }

}
