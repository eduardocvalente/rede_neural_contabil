import { Card } from "./Card";

export class CardFactory {
    static create(json: any): Card {
        return new Card(
            json.tpIntegra?.[0] || '',  // Verifica se json.tpIntegra existe e se é um array, retorna string vazia se não existir
            json.tBand?.[0] || ''       // Verifica se json.tBand existe e se é um array, retorna string vazia se não existir
        );
    }
}
