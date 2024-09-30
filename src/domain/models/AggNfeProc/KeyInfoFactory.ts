import { KeyInfo } from "./KeyInfo";
import { X509DataFactory } from "./X509DataFactory";

export class KeyInfoFactory {
    static create(json: any): KeyInfo {
        return new KeyInfo(
            json?.X509Data?.map((data: any) => X509DataFactory.create(data)) || [] // Verifica se X509Data existe, senão usa um array vazio
        );
    }
}
