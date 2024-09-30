import { AutoMap } from '@automapper/classes';
import { ICMSTotDTO } from "./ICMSTotDTO";

/*Conferido dia 03/09/2024 às 15:12*/
export class TotalDTO {
    @AutoMap(() => ICMSTotDTO)
    ICMSTot: ICMSTotDTO;

    constructor(ICMSTot: ICMSTotDTO) {
        this.ICMSTot = ICMSTot;
    }
}
