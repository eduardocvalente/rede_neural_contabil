import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:33*/
export class SignatureMethodDTO {
    @AutoMap()
    Algorithm: string;

    constructor(Algorithm: string) {
        this.Algorithm = Algorithm;
    }
}
