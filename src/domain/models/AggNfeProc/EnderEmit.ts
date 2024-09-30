import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 14:59*/
export class EnderEmit {
    @AutoMap()
    xLgr: string;

    @AutoMap()
    nro: string;

    @AutoMap()
    xCpl: string;

    @AutoMap()
    xBairro: string;

    @AutoMap()
    cMun: string;

    @AutoMap()
    xMun: string;

    @AutoMap()
    UF: string;

    @AutoMap()
    CEP: string;

    @AutoMap()
    cPais: string;

    @AutoMap()
    fone: string;

    constructor(
        xLgr: string, nro: string, xCpl: string, xBairro: string, cMun: string,
        xMun: string, UF: string, CEP: string, cPais: string, fone: string
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
