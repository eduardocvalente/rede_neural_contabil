import { Transp } from "./Transp";

export class TranspFactory {
    static create(json: any): Transp {
        return new Transp(
            json?.modFrete?.[0] || '' // Usa um valor padrão vazio se modFrete não estiver presente
        );
    }
}
