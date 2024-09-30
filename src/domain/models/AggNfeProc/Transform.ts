import { AutoMap } from '@automapper/classes';

export class Transform {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
