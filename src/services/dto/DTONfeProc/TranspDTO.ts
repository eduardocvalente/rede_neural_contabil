import { AutoMap } from '@automapper/classes';

/*Conferido 03/09/2024 às 15:17*/
export class TranspDTO {
    @AutoMap()
    modFrete: string;

    constructor(modFrete: string) {
        this.modFrete = modFrete;
    }
}
