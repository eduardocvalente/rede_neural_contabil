import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:25*/
export class InfAdic {
    @AutoMap()
    infCpl: string;

    constructor(infCpl: string) {
        this.infCpl = infCpl;
    }
}
