import { INfeService } from '../interfaces/INfeService';
import { NfeProc } from '../../domain/models/AggNfeProc/NfeProc';
import { NfeProcFactory } from '../../domain/models/AggNfeProc/NfeProcFactory';
import { configureMappings, mapper } from '../../automapperConfig'; // Importa o mapper configurado
import { NfeProcDTO } from '../dto/DTONfeProc/NfeProcDTO';
import { injectable } from 'inversify/lib/inversify';

@injectable()
export class NfeService implements INfeService {
  constructor() {
    // Configura os mapeamentos
    configureMappings();
  }

  // Método responsável por processar os dados JSON e criar o objeto NfeProcDTO em memória
  processNfeData(json: any): NfeProcDTO {
    try {
      // Usamos a factory para criar o objeto NfeProc
      const nfeProc = NfeProcFactory.create(json);
      let nfeProcDTO = mapper.map(nfeProc, NfeProc, NfeProcDTO);
      return nfeProcDTO;
    } catch (error) {
      console.error('Erro ao processar os dados da NFe:', error);
      throw new Error('Falha ao processar os dados da NFe.');
    }
  }
}
