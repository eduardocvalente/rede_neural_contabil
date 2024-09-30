import { AutoMap } from '@automapper/classes';

/*Conferido dia 03/09/2024 às 15:12*/
export class ICMSTot {
    @AutoMap()
    vBC: string;

    @AutoMap()
    vICMS: string;

    @AutoMap()
    vICMSDeson: string;

    @AutoMap()
    vFCPUFDest: string;

    @AutoMap()
    vICMSUFDest: string;

    @AutoMap()
    vICMSUFRemet: string;

    @AutoMap()
    vFCP: string;

    @AutoMap()
    vBCST: string;

    @AutoMap()
    vST: string;

    @AutoMap()
    vFCPST: string;

    @AutoMap()
    vFCPSTRet: string;

    @AutoMap()
    vProd: string;

    @AutoMap()
    vFrete: string;

    @AutoMap()
    vSeg: string;

    @AutoMap()
    vDesc: string;

    @AutoMap()
    vII: string;

    @AutoMap()
    vIPI: string;

    @AutoMap()
    vIPIDevol: string;

    @AutoMap()
    vPIS: string;

    @AutoMap()
    vCOFINS: string;

    @AutoMap()
    vOutro: string;

    @AutoMap()
    vNF: string;

    @AutoMap()
    vTotTrib: string;

    constructor(
        vBC: string, vICMS: string, vICMSDeson: string, vFCPUFDest: string, vICMSUFDest: string,
        vICMSUFRemet: string, vFCP: string, vBCST: string, vST: string, vFCPST: string, vFCPSTRet: string,
        vProd: string, vFrete: string, vSeg: string, vDesc: string, vII: string, vIPI: string,
        vIPIDevol: string, vPIS: string, vCOFINS: string, vOutro: string, vNF: string, vTotTrib: string
    ) {
        this.vBC = vBC;
        this.vICMS = vICMS;
        this.vICMSDeson = vICMSDeson;
        this.vFCPUFDest = vFCPUFDest;
        this.vICMSUFDest = vICMSUFDest;
        this.vICMSUFRemet = vICMSUFRemet;
        this.vFCP = vFCP;
        this.vBCST = vBCST;
        this.vST = vST;
        this.vFCPST = vFCPST;
        this.vFCPSTRet = vFCPSTRet;
        this.vProd = vProd;
        this.vFrete = vFrete;
        this.vSeg = vSeg;
        this.vDesc = vDesc;
        this.vII = vII;
        this.vIPI = vIPI;
        this.vIPIDevol = vIPIDevol;
        this.vPIS = vPIS;
        this.vCOFINS = vCOFINS;
        this.vOutro = vOutro;
        this.vNF = vNF;
        this.vTotTrib = vTotTrib;
    }

}
