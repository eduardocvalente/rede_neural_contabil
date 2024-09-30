import { Emit } from "./Emit";
import { EnderEmitFactory } from "./EnderEmitFactory";

export class EmitFactory {
    static create(json: any): Emit {
        //console.log("EmitFactory JSON:", JSON.stringify(json, null, 2));
        return new Emit(
            json.CNPJ[0],
            json.xNome[0],
            EnderEmitFactory.create(json.enderEmit[0]),
            json.IE[0],
            json.CRT[0]
        );
    }
}
