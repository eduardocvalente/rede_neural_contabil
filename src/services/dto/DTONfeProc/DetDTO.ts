/* Conferido dia 03/09/2024 às 15:09 */
import { AutoMap } from '@automapper/classes';
import { ImpostoDTO } from './ImpostoDTO';
import { ProdDTO } from './ProdDTO';

export class DetDTO {
  @AutoMap()
  public nItem: string;

  @AutoMap(() => ProdDTO)
  public prod: ProdDTO;

  @AutoMap(() => ImpostoDTO)
  public imposto: ImpostoDTO;

  constructor(nItem: string, prod: ProdDTO, imposto: ImpostoDTO) {
    this.nItem = nItem;
    this.prod = prod;
    this.imposto = imposto;
  }
}
