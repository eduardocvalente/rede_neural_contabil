import { InfAdic } from "./InfAdic";

export class InfAdicFactory {
    static create(json: any): InfAdic {
        return new InfAdic(
            json?.infCpl?.[0] || ''
        );
    }
}
