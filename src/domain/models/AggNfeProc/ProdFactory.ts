import { Prod } from "./Prod";

export class ProdFactory {
    static create(json: any): Prod {
        return new Prod(
            json?.cProd?.[0] || '',   // Verifica se cProd existe e retorna uma string vazia se não existir
            json?.cEAN?.[0] || '',    // Verifica se cEAN existe
            json?.xProd?.[0] || '',   // Verifica se xProd existe
            json?.NCM?.[0] || '',     // Verifica se NCM existe
            json?.CEST?.[0] || '',    // Verifica se CEST existe
            json?.CFOP?.[0] || '',    // Verifica se CFOP existe
            json?.uCom?.[0] || '',    // Verifica se uCom existe
            json?.qCom?.[0] || '',    // Verifica se qCom existe
            json?.vUnCom?.[0] || '',  // Verifica se vUnCom existe
            json?.vProd?.[0] || '',   // Verifica se vProd existe
            json?.cEANTrib?.[0] || '',// Verifica se cEANTrib existe
            json?.uTrib?.[0] || '',   // Verifica se uTrib existe
            json?.qTrib?.[0] || '',   // Verifica se qTrib existe
            json?.vUnTrib?.[0] || '', // Verifica se vUnTrib existe
            json?.indTot?.[0] || '',  // Verifica se indTot existe
            json?.nItemPed?.[0] || '' // Verifica se nItemPed existe
        );
    }
}
