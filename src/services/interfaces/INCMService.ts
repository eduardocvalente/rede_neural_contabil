import { NCM } from '../../domain/models/AggNCM/NCM';

export interface INCMService {
  getAllNCM(): NCM[];
}
