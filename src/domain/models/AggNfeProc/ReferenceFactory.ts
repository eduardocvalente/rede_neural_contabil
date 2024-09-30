import { Reference } from "./Reference";
import { TransformFactory } from "./TransformFactory";

export class ReferenceFactory {
    static create(json: any): Reference {
        return new Reference(
            json?.$?.URI || '', // Verifica se json.$ e json.$.URI existem
            json?.Transforms?.[0]?.Transform ?
                json.Transforms[0].Transform.map((transform: any) => TransformFactory.create(transform))
                : [], // Verifica se Transforms e Transform existem antes de iterar
            json?.DigestMethod?.[0]?.$?.Algorithm || '', // Verifica se DigestMethod e Algorithm existem
            json?.DigestValue?.[0] || '' // Verifica se DigestValue existe
        );
    }
}
