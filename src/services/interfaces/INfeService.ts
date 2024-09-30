import { NfeProcDTO } from '../dto/DTONfeProc/NfeProcDTO';

export interface INfeService {
  processNfeData(json: any): NfeProcDTO;
}
