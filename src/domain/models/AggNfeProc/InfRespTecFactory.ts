import { InfRespTec } from "./InfRespTec";

export class InfRespTecFactory {
    static create(json: any): InfRespTec {
        return new InfRespTec(
            json?.CNPJ?.[0] || '',        // Verifica se CNPJ existe, senão usa uma string vazia
            json?.xContato?.[0] || '',    // Verifica se xContato existe, senão usa uma string vazia
            json?.email?.[0] || '',       // Verifica se email existe, senão usa uma string vazia
            json?.fone?.[0] || ''         // Verifica se fone existe, senão usa uma string vazia
        );
    }
}
