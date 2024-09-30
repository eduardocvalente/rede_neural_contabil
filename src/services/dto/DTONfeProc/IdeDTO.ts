import { AutoMap } from '@automapper/classes';

/* Conferido 03/09/2024 às 14:54 */
export class IdeDTO {
    @AutoMap()
    cUF: string;

    @AutoMap()
    cNF: string;

    @AutoMap()
    natOp: string;

    @AutoMap()
    mod: string;

    @AutoMap()
    serie: string;

    @AutoMap()
    nNF: string;

    @AutoMap()
    dhEmi: string;

    @AutoMap()
    tpNF: string;

    @AutoMap()
    idDest: string;

    @AutoMap()
    cMunFG: string;

    @AutoMap()
    tpImp: string;

    @AutoMap()
    tpEmis: string;

    @AutoMap()
    cDV: string;

    @AutoMap()
    tpAmb: string;

    @AutoMap()
    finNFe: string;

    @AutoMap()
    indFinal: string;

    @AutoMap()
    indPres: string;

    @AutoMap()
    procEmi: string;

    @AutoMap()
    verProc: string;

    constructor(
        cUF: string, cNF: string, natOp: string, mod: string, serie: string, nNF: string,
        dhEmi: string, tpNF: string, idDest: string, cMunFG: string, tpImp: string,
        tpEmis: string, cDV: string, tpAmb: string, finNFe: string, indFinal: string,
        indPres: string, procEmi: string, verProc: string
    ) {
        this.cUF = cUF;
        this.cNF = cNF;
        this.natOp = natOp;
        this.mod = mod;
        this.serie = serie;
        this.nNF = nNF;
        this.dhEmi = dhEmi;
        this.tpNF = tpNF;
        this.idDest = idDest;
        this.cMunFG = cMunFG;
        this.tpImp = tpImp;
        this.tpEmis = tpEmis;
        this.cDV = cDV;
        this.tpAmb = tpAmb;
        this.finNFe = finNFe;
        this.indFinal = indFinal;
        this.indPres = indPres;
        this.procEmi = procEmi;
        this.verProc = verProc;
    }
}
