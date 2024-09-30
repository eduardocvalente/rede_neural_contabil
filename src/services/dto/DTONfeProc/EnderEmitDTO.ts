import { AutoMap } from '@automapper/classes';

/* Conferido dia 03/09/2024 às 14:59 */
export class EnderEmitDTO {
    @AutoMap()
    public xLgr: string;

    @AutoMap()
    public nro: string;

    @AutoMap()
    public xCpl: string;

    @AutoMap()
    public xBairro: string;

    @AutoMap()
    public cMun: string;

    @AutoMap()
    public xMun: string;

    @AutoMap()
    public UF: string;

    @AutoMap()
    public CEP: string;

    @AutoMap()
    public cPais: string;

    @AutoMap()
    public fone: string;

    constructor(
        xLgr: string, 
        nro: string, 
        xCpl: string, 
        xBairro: string, 
        cMun: string,
        xMun: string, 
        UF: string, 
        CEP: string, 
        cPais: string, 
        fone: string
    ) {
        this.xLgr = xLgr;
        this.nro = nro;
        this.xCpl = xCpl;
        this.xBairro = xBairro;
        this.cMun = cMun;
        this.xMun = xMun;
        this.UF = UF;
        this.CEP = CEP;
        this.cPais = cPais;
        this.fone = fone;
    }
}
