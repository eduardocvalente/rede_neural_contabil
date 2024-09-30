import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:32*/
export class CanonicalizationMethodDTO {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
