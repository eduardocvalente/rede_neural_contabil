export class NfeTrainingDataDTO {
  public cnaePrincipal: string;
  public cnaeEntrada: string;
  public ncmItem: string[];

  constructor(cnaePrincipal: string, cnaeEntrada: string, ncmItem: string[]) {
    this.cnaePrincipal = cnaePrincipal;
    this.cnaeEntrada = cnaeEntrada;
    this.ncmItem = ncmItem;
  }
}
