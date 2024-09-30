import { Det } from "./Det";
import { ImpostoFactory } from "./ImpostoFactory";
import { ProdFactory } from "./ProdFactory";

export class DetFactory {
    static create(json: any): Det {
        return new Det(
            json.$?.nItem || "", // Verifica se json.$ e nItem existem, caso contrário, passa uma string vazia
            ProdFactory.create(json.prod?.[0] || {}), // Verifica se json.prod existe, caso contrário, passa um objeto vazio
            ImpostoFactory.create(json.imposto?.[0] || {}) // Verifica se json.imposto existe, caso contrário, passa um objeto vazio
        );
    }
}
