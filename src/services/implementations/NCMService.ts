import { INCMService } from '../interfaces/INCMService';
import { INCMRepository } from '../../domain/models/AggNCM/INCMRepository';
import { NCM } from '../../domain/models/AggNCM/NCM';
import { inject, injectable } from 'inversify/lib/inversify';

@injectable()
export class NCMService implements INCMService {
  private ncmRepository: INCMRepository;

  constructor(@inject('INCMRepository') ncmRepository: INCMRepository) {
    this.ncmRepository = ncmRepository;
  }

  getAllNCM(): NCM[] {
    return this.ncmRepository.findAll();
  }
}
