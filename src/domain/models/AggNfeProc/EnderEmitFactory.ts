import { EnderEmit } from "./EnderEmit";

export class EnderEmitFactory {
    static create(json: any): EnderEmit {
        return new EnderEmit(
            json.xLgr?.[0] || '',   // Verifica se existe json.xLgr e se é um array
            json.nro?.[0] || '',    // Verifica se existe json.nro e se é um array
            json.xCpl?.[0] || '',   // Verifica se existe json.xCpl e se é um array
            json.xBairro?.[0] || '',// Verifica se existe json.xBairro e se é um array
            json.cMun?.[0] || '',   // Verifica se existe json.cMun e se é um array
            json.xMun?.[0] || '',   // Verifica se existe json.xMun e se é um array
            json.UF?.[0] || '',     // Verifica se existe json.UF e se é um array
            json.CEP?.[0] || '',    // Verifica se existe json.CEP e se é um array
            json.cPais?.[0] || '',  // Verifica se existe json.cPais e se é um array
            json.fone?.[0] || ''    // Verifica se existe json.fone e se é um array
        );
    }
}

