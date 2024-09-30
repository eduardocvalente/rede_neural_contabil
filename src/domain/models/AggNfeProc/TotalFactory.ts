import { ICMSTotFactory } from "./ICMSTotFactory";
import { Total } from "./Total";

export class TotalFactory {
    static create(json: any): Total {
        return new Total(
            ICMSTotFactory.create(json.ICMSTot[0])
        );
    }
}
