import { PIS } from "./PIS";
import { PISTypeFactory } from "./PISTypeFactory";

export class PISFactory {
    static create(json: any): PIS {
         // Pega a chave principal (nome do tipo de PIS)
         const pisType = Object.keys(json)[0];
        return new PIS(
            PISTypeFactory.create(json[pisType][0])
        );
    }
}
