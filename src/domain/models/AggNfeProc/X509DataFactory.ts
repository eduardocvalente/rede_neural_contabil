import { X509Data } from "./X509Data";

export class X509DataFactory {
    static create(json: any): X509Data {
        return new X509Data(
            json?.X509Certificate?.[0] || '' // Usa um valor padrão vazio se X509Certificate não estiver presente
        );
    }
}
