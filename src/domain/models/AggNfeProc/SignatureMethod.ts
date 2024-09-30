import { AutoMap } from '@automapper/classes';

export class SignatureMethod {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
