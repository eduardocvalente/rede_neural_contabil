import { InfProt } from "./InfProt";

export class InfProtFactory {
    static create(json: any): InfProt {
        return new InfProt(
            json?.$?.Id || '',            // Verifica se json.$ e Id existem, senão usa uma string vazia
            json?.tpAmb?.[0] || '',        // Verifica se tpAmb existe, senão usa uma string vazia
            json?.verAplic?.[0] || '',     // Verifica se verAplic existe, senão usa uma string vazia
            json?.chNFe?.[0] || '',        // Verifica se chNFe existe, senão usa uma string vazia
            json?.dhRecbto?.[0] || '',     // Verifica se dhRecbto existe, senão usa uma string vazia
            json?.nProt?.[0] || '',        // Verifica se nProt existe, senão usa uma string vazia
            json?.digVal?.[0] || '',       // Verifica se digVal existe, senão usa uma string vazia
            json?.cStat?.[0] || '',        // Verifica se cStat existe, senão usa uma string vazia
            json?.xMotivo?.[0] || ''       // Verifica se xMotivo existe, senão usa uma string vazia
        );
    }
}
