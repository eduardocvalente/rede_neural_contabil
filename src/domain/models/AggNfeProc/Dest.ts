import { AutoMap } from '@automapper/classes';
import { EnderDest } from "./EnderDest";

export class Dest {
    @AutoMap()
    public CNPJ: string;         // CNPJ do destinatário

    @AutoMap()
    public xNome: string;        // Nome do destinatário

    @AutoMap(() => EnderDest)
    public enderDest: EnderDest; // Endereço do destinatário

    @AutoMap()
    public indIEDest: string;    // Indicador de Inscrição Estadual

    @AutoMap()
    public email: string;        // Email do destinatário

    constructor(
        CNPJ: string,         
        xNome: string,        
        enderDest: EnderDest, 
        indIEDest: string,    
        email: string         
    ) {
        this.CNPJ = CNPJ;
        this.xNome = xNome;
        this.enderDest = enderDest;
        this.indIEDest = indIEDest;
        this.email = email;
    }
}
