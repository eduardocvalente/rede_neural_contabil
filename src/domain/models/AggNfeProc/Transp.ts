/*Conferido 03/09/2024 às 15:17*/
import { AutoMap } from '@automapper/classes';

export class Transp {
    @AutoMap()
    modFrete: string;

    constructor(modFrete: string) {
        this.modFrete = modFrete;
    }
}
