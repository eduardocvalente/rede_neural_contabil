import { InfNFeFactory } from "./InfNFeFactory";
import { InfNFeSuplFactory } from "./InfNFeSuplFactory";
import { NFe } from "./NFe";
import { SignatureFactory } from "./SignatureFactory";

export class NFeFactory {
    static create(json: any): NFe {
        return new NFe(
            json?.$?.xmlns || '', // Verifica se a propriedade existe, caso contrário, usa uma string vazia
            json?.infNFe?.map((inf: any) => InfNFeFactory.create(inf)) || [], // Verifica se infNFe existe, caso contrário, usa um array vazio
            json?.infNFeSupl?.map((infSupl: any) => InfNFeSuplFactory.create(infSupl)) || [], // Verifica se infNFeSupl existe, caso contrário, usa um array vazio
            json?.Signature?.map((signature: any) => SignatureFactory.create(signature)) || [] // Verifica se Signature existe, caso contrário, usa um array vazio
        );
    }
}
