import { COFINS } from "./COFINS";
import { COFINSTypeFactory } from "./COFINSTypeFactory";

export class COFINSFactory {
    static create(json: any): COFINS {
        // Pega a chave principal (nome do tipo de COFINS)
        const cofinsType = Object.keys(json)[0];
        return new COFINS(
            COFINSTypeFactory.create(json[cofinsType][0]) // Verifica se COFINSOutr existe, caso contrário, passa um objeto vazio
        );
    }
}
