import { AutoMap } from '@automapper/classes';
import { X509Data } from "./X509Data";

/*Conferido dia 03/09/2024 às 15:38*/
export class KeyInfo {
    @AutoMap(() => X509Data)
    X509Data: X509Data;

    constructor(X509Data: X509Data) {
        this.X509Data = X509Data;
    }
}
