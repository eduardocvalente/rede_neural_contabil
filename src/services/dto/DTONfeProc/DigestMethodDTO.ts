import { AutoMap } from '@automapper/classes';

export class DigestMethodDTO {
    @AutoMap()
    public Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
