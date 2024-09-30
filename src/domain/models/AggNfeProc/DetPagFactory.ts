import { CardFactory } from "./CardFactory";
import { DetPag } from "./DetPag";

export class DetPagFactory {
    static create(json: any): DetPag {
        return new DetPag(
            json.indPag?.[0] || '', // Verifica se json.indPag existe e retorna string vazia se não existir
            json.tPag?.[0] || '',   // Verifica se json.tPag existe e retorna string vazia se não existir
            json.vPag?.[0] || '0.00', // Verifica se json.vPag existe e retorna '0.00' se não existir
            CardFactory.create(json.card?.[0] || {}) // Verifica se json.card existe, se não, passa um objeto vazio
        );
    }
}
