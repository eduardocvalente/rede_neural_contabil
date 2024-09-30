import { Transform } from "./Transform";

export class TransformFactory {
    static create(json: any): Transform {
        return new Transform(
            json?.$?.Algorithm || '' // Usa um valor padrão vazio se Algorithm não estiver presente
        );
    }
}
