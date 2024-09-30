import { TrainingData } from './TrainingData';

export abstract class ITrainingDataRepository {
  abstract findAll(): TrainingData[];
  abstract save(trainingData: TrainingData): void;
  abstract saveAll(trainingData: TrainingData[]): void;
}
