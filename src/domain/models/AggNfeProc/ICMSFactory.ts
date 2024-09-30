import { ICMS } from "./ICMS";
import { ICMSTypeFactory } from "./ICMSTypeFactory";

export class ICMSFactory {
    static create(json: any): ICMS {
        // Pega a chave principal (nome do tipo de ICMS)
        const icmsType = Object.keys(json)[0];
        return new ICMS(
            ICMSTypeFactory.create(json[icmsType][0])
        );
    }
}
