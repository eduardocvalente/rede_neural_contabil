import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:29*/
export class InfNFeSupl {
    @AutoMap()
    qrCode: string;

    @AutoMap()
    urlChave: string;

    constructor(qrCode: string, urlChave: string) {
        this.qrCode = qrCode;
        this.urlChave = urlChave;
    }

}
