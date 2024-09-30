import { CNAE } from '../../domain/models/AggCNAE/CNAE';

export interface ICNAEService {
  getAllCNAE(): CNAE[];
}
