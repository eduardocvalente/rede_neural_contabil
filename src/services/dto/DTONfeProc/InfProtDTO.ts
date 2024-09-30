//Conferido as 03/09/2024 às 14:48
import { AutoMap } from '@automapper/classes';

export class InfProtDTO {
    @AutoMap()
    Id: string;

    @AutoMap()
    tpAmb: string;

    @AutoMap()
    verAplic: string;

    @AutoMap()
    chNFe: string;

    @AutoMap()
    dhRecbto: string;

    @AutoMap()
    nProt: string;

    @AutoMap()
    digVal: string;

    @AutoMap()
    cStat: string;

    @AutoMap()
    xMotivo: string;

    constructor(
        Id: string, tpAmb: string, verAplic: string, chNFe: string,
        dhRecbto: string, nProt: string, digVal: string, cStat: string, xMotivo: string
    ) {
        this.Id = Id;
        this.tpAmb = tpAmb;
        this.verAplic = verAplic;
        this.chNFe = chNFe;
        this.dhRecbto = dhRecbto;
        this.nProt = nProt;
        this.digVal = digVal;
        this.cStat = cStat;
        this.xMotivo = xMotivo;
    }
}
