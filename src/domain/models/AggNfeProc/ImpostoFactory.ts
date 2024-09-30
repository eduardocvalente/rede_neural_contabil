import { COFINSFactory } from "./COFINSFactory";
import { ICMSFactory } from "./ICMSFactory";
import { Imposto } from "./Imposto";
import { PISFactory } from "./PISFactory";

export class ImpostoFactory {
    static create(json: any): Imposto {
        //console.log("Creating Imposto from JSON:", JSON.stringify(json, null, 2));
        return new Imposto(
            json?.vTotTrib?.[0] || "",
            ICMSFactory.create(json.ICMS[0]),
            PISFactory.create(json.PIS[0]),
            COFINSFactory.create(json.COFINS[0])
        );
    }
}
