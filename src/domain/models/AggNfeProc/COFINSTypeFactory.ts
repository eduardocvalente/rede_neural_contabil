import { COFINSType } from "./COFINSType";

export class COFINSTypeFactory {
    static create(json: any): COFINSType {
        return new COFINSType(
            json.CST?.[0] || '',         // Verifica se json.CST existe e é um array, retorna string vazia se não existir
            json.vBC?.[0] || '0.00',     // Verifica se json.vBC existe e é um array, retorna '0.00' se não existir
            json.pCOFINS?.[0] || '0.00', // Verifica se json.pCOFINS existe e é um array, retorna '0.00' se não existir
            json.vCOFINS?.[0] || '0.00'  // Verifica se json.vCOFINS existe e é um array, retorna '0.00' se não existir
        );
    }
}
