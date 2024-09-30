/*Conferido dia 03/09/2024 às 15:29*/
import { AutoMap } from '@automapper/classes';

export class InfNFeSuplDTO {
    @AutoMap()
    qrCode: string;

    @AutoMap()
    urlChave: string;

    constructor(qrCode: string, urlChave: string) {
        this.qrCode = qrCode;
        this.urlChave = urlChave;
    }
}
