import { InfNFeSupl } from "./InfNFeSupl";

export class InfNFeSuplFactory {
    static create(json: any): InfNFeSupl {
        return new InfNFeSupl(
            json?.qrCode?.[0] || '',    // Verifica se qrCode existe, senão retorna uma string vazia
            json?.urlChave?.[0] || ''   // Verifica se urlChave existe, senão retorna uma string vazia
        );
    }
}
