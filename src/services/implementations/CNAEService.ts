import { ICNAEService } from '../interfaces/ICNAEService';
import { ICNAERepository } from '../../domain/models/AggCNAE/ICNAERepository';
import { CNAE } from '../../domain/models/AggCNAE/CNAE';
import { inject, injectable } from 'inversify/lib/inversify';

@injectable()
export class CNAEService implements ICNAEService {
  private cnaeRepository: ICNAERepository;

  constructor(@inject('ICNAERepository') cnaeRepository: ICNAERepository) {
    this.cnaeRepository = cnaeRepository;
  }

  getAllCNAE(): CNAE[] {
    return this.cnaeRepository.findAll();
  }
}
