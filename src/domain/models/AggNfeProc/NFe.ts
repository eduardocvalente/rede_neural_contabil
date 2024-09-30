import { AutoMap } from '@automapper/classes';
import { InfNFe } from "./InfNFe";
import { InfNFeSupl } from "./InfNFeSupl";
import { Signature } from "./Signature";

/*Conferido dia 03/09/2024 às 15:39*/
export class NFe {
    @AutoMap()
    xmlns: string;

    @AutoMap(() => [InfNFe])
    infNFe: InfNFe[];

    @AutoMap(() => InfNFeSupl)
    infNFeSupl: InfNFeSupl;

    @AutoMap(() => Signature)
    Signature: Signature;

    constructor(xmlns: string, infNFe: InfNFe[], infNFeSupl: InfNFeSupl, Signature: Signature) {
        this.xmlns = xmlns;
        this.infNFe = infNFe;
        this.infNFeSupl = infNFeSupl;
        this.Signature = Signature;
    }
}
