/*Conferido dia 03/09/2024 às 15:38*/
import { AutoMap } from '@automapper/classes';

export class X509Data {
    @AutoMap()
    X509Certificate: string;

    constructor(X509Certificate: string) {
        this.X509Certificate = X509Certificate;
    }
}
