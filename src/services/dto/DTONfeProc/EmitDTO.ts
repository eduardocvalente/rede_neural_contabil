import { AutoMap } from '@automapper/classes';
import { EnderEmitDTO } from "./EnderEmitDTO";

/*Conferido dia 03/09/2024 às 15:01*/
export class EmitDTO {
    @AutoMap()
    public CNPJ: string;

    @AutoMap()
    public xNome: string;

    @AutoMap(() => EnderEmitDTO)
    public enderEmit: EnderEmitDTO;

    @AutoMap()
    public IE: string;

    @AutoMap()
    public CRT: string;

    constructor(CNPJ: string, xNome: string, enderEmit: EnderEmitDTO, IE: string, CRT: string) {
        this.CNPJ = CNPJ;
        this.xNome = xNome;
        this.enderEmit = enderEmit;
        this.IE = IE;
        this.CRT = CRT;
    }
}
