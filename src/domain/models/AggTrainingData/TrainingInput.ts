import { AutoMap } from '@automapper/classes';

export class TrainingInput {
  @AutoMap()
  public cnaePrincipal: string;

  @AutoMap()
  public cnaeEntrada: string;

  @AutoMap()
  public ncm: string;

  constructor(cnaePrincipal: string, cnaeEntrada: string, ncm: string) {
    this.cnaePrincipal = cnaePrincipal;
    this.cnaeEntrada = cnaeEntrada;
    this.ncm = ncm;
  }
}
