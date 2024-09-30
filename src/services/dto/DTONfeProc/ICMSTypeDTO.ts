import { AutoMap } from '@automapper/classes';

export class ICMSTypeDTO {
    @AutoMap()
    orig: string;

    @AutoMap()
    CSOSN: string;

    @AutoMap()
    vBCSTRet: string;

    @AutoMap()
    pST: string;

    @AutoMap()
    vICMSSubstituto: string;

    @AutoMap()
    vICMSSTRet: string;

    constructor(
        orig: string, CSOSN: string, vBCSTRet: string, pST: string, vICMSSubstituto: string, vICMSSTRet: string
    ) {
        this.orig = orig;
        this.CSOSN = CSOSN;
        this.vBCSTRet = vBCSTRet;
        this.pST = pST;
        this.vICMSSubstituto = vICMSSubstituto;
        this.vICMSSTRet = vICMSSTRet;
    }
}
