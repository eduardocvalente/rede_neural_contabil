import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:38*/
export class X509DataDTO {
    @AutoMap()
    X509Certificate: string;

    constructor(X509Certificate: string) {
        this.X509Certificate = X509Certificate;
    }
}
