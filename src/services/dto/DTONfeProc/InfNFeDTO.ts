import { AutoMap } from '@automapper/classes';
import { AutXMLDTO } from './AutXMLDTO';
import { DestDTO } from './DestDTO';
import { DetDTO } from './DetDTO';
import { EmitDTO } from './EmitDTO';
import { IdeDTO } from './IdeDTO';
import { InfAdicDTO } from './InfAdicDTO';
import { InfRespTecDTO } from './InfRespTecDTO';
import { PagDTO } from './PagDTO';
import { TotalDTO } from './TotalDTO';
import { TranspDTO } from './TranspDTO';

export class InfNFeDTO {
  @AutoMap()
  Id: string;

  @AutoMap()
  versao: string;

  @AutoMap(() => IdeDTO)
  ide: IdeDTO;

  @AutoMap(() => EmitDTO)
  emit: EmitDTO;

  @AutoMap(() => DestDTO)
  dest: DestDTO;

  @AutoMap(() => [AutXMLDTO])
  autXML: AutXMLDTO[];

  @AutoMap(() => [DetDTO])
  det: DetDTO[];

  @AutoMap(() => TotalDTO)
  total: TotalDTO;

  @AutoMap(() => TranspDTO)
  transp: TranspDTO;

  @AutoMap(() => PagDTO)
  pag: PagDTO;

  @AutoMap(() => InfAdicDTO)
  infAdic: InfAdicDTO;

  @AutoMap(() => InfRespTecDTO)
  infRespTec: InfRespTecDTO;

  constructor(
    Id: string,
    versao: string,
    ide: IdeDTO,
    emit: EmitDTO,
    dest: DestDTO,
    autXML: AutXMLDTO[],
    det: DetDTO[],
    total: TotalDTO,
    transp: TranspDTO,
    pag: PagDTO,
    infAdic: InfAdicDTO,
    infRespTec: InfRespTecDTO,
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
