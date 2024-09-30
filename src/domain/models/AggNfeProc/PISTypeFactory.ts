import { PISType } from "./PISType";

export class PISTypeFactory {
    static create(json: any): PISType {
        return new PISType(
            json?.CST?.[0] || '', // Verifica se CST existe e, caso contrário, retorna uma string vazia
            json?.vBC?.[0] || '', // Verifica se vBC existe e, caso contrário, retorna uma string vazia
            json?.pPIS?.[0] || '', // Verifica se pPIS existe e, caso contrário, retorna uma string vazia
            json?.vPIS?.[0] || ''  // Verifica se vPIS existe e, caso contrário, retorna uma string vazia
        );
    }
}
