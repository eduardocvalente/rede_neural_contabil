import { AutoMap } from '@automapper/classes';
import { Imposto } from "./Imposto";
import { Prod } from "./Prod";

/*Conferido dia 03/09/2024 às 15:09*/
export class Det {
    @AutoMap()
    nItem: string;

    @AutoMap(() => Prod)
    prod: Prod;

    @AutoMap(() => Imposto)
    imposto: Imposto;

    constructor(nItem: string, prod: Prod, imposto: Imposto) {
        this.nItem = nItem;
        this.prod = prod;
        this.imposto = imposto;
    }
}
