import { AutoMap } from '@automapper/classes';
import { ICMSTot } from "./ICMSTot";

export class Total {
    @AutoMap()
    ICMSTot: ICMSTot;

    constructor(ICMSTot: ICMSTot) {
        this.ICMSTot = ICMSTot;
    }
}
