import { AutoMap } from '@automapper/classes';
import { AutXML } from "./AutXML";
import { Dest } from "./Dest";
import { Det } from "./Det";
import { Emit } from "./Emit";
import { Ide } from "./Ide";
import { InfAdic } from "./InfAdic";
import { InfRespTec } from "./InfRespTec";
import { Pag } from "./Pag";
import { Total } from "./Total";
import { Transp } from "./Transp";

export class InfNFe {
    @AutoMap()
    Id: string;

    @AutoMap()
    versao: string;

    @AutoMap(() => Ide)
    ide: Ide;

    @AutoMap(() => Emit)
    emit: Emit;

    @AutoMap(() => Dest)
    dest: Dest;

    @AutoMap(() => [AutXML])
    autXML: AutXML[];

    @AutoMap(() => [Det])
    det: Det[];

    @AutoMap(() => Total)
    total: Total;

    @AutoMap(() => Transp)
    transp: Transp;

    @AutoMap(() => Pag)
    pag: Pag;

    @AutoMap(() => InfAdic)
    infAdic: InfAdic;

    @AutoMap(() => InfRespTec)
    infRespTec: InfRespTec;

    constructor(
        Id: string, versao: string, ide: Ide, emit: Emit, dest: Dest, autXML: AutXML[], 
        det: Det[], total: Total, transp: Transp, pag: Pag, infAdic: InfAdic, infRespTec: InfRespTec
    ) {
        this.Id = Id;
        this.versao = versao;
        this.ide = ide;
        this.emit = emit;
        this.dest = dest;
        this.autXML = autXML;
        this.det = det;
        this.total = total;
        this.transp = transp;
        this.pag = pag;
        this.infAdic = infAdic;
        this.infRespTec = infRespTec;
    }
}
