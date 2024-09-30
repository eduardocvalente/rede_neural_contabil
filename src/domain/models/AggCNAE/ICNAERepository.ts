import { CNAE } from './CNAE';

export interface ICNAERepository {
  findAll(): CNAE[];
}
