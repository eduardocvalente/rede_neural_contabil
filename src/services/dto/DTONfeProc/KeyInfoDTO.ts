/*Conferido dia 03/09/2024 às 15:38*/
import { AutoMap } from '@automapper/classes';
import { X509DataDTO } from "./X509DataDTO";

export class KeyInfoDTO {
    @AutoMap()
    X509Data: X509DataDTO;

    constructor(X509Data: X509DataDTO) {
        this.X509Data = X509Data;
    }
}
