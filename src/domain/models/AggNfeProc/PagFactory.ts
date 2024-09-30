import { DetPagFactory } from "./DetPagFactory";
import { Pag } from "./Pag";

export class PagFactory {
    static create(json: any): Pag {
        return new Pag(
            json?.detPag?.map((det: any) => DetPagFactory.create(det)) || [] // Verifica se detPag existe e mapeia, ou retorna array vazio
        );
    }
}
