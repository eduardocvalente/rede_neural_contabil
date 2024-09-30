import { AutoMap } from '@automapper/classes';
import { EnderEmit } from "./EnderEmit";

/*Conferido dia 03/09/2024 às 15:01*/
export class Emit {
    @AutoMap()
    CNPJ: string;

    @AutoMap()
    xNome: string;

    @AutoMap(() => EnderEmit)
    enderEmit: EnderEmit;

    @AutoMap()
    IE: string;

    @AutoMap()
    CRT: string;

    constructor(CNPJ: string, xNome: string, enderEmit: EnderEmit, IE: string, CRT: string) {
        this.CNPJ = CNPJ;
        this.xNome = xNome;
        this.enderEmit = enderEmit;
        this.IE = IE;
        this.CRT = CRT;
    }

}
