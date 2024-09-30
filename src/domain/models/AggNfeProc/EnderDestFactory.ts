import { EnderDest } from "./EnderDest";

export class EnderDestFactory {
    static create(json: any): EnderDest {
        return new EnderDest(
            json?.xLgr?.[0] || '',
            json?.nro?.[0] || '',
            json?.xCpl?.[0] || '',
            json?.xBairro?.[0] || '',
            json?.cMun?.[0] || '',
            json?.xMun?.[0] || '',
            json?.UF?.[0] || '',
            json?.CEP?.[0] || '',
            json?.cPais?.[0] || '',
            json?.xPais?.[0] || ''
        );
    }
}
