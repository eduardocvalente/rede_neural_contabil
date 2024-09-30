import { NCM } from './NCM';

export interface INCMRepository {
    findAll(): NCM[];
}
