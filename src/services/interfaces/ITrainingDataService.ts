import { TrainingData } from '../../domain/models/AggTrainingData/TrainingData';

export interface ITrainingDataService {
  getAll(): Promise<TrainingData[]>;
  addTrainingData(input: TrainingData): Promise<void>;
  retrainNetwork(): Promise<void>;
  classify(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): Promise<{
    contaDebito: string | null;
    contaCredito: string | null;
    confidences: { contaDebito: number; contaCredito: number };
  }>;
}
