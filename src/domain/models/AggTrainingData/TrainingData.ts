import { AutoMap } from '@automapper/classes';
import { TrainingInput } from './TrainingInput';
import { TrainingOutput } from './TrainingOutput';

export class TrainingData {
  @AutoMap()
  public input: TrainingInput;

  @AutoMap()
  public output: TrainingOutput;

  constructor(input: TrainingInput, output: TrainingOutput) {
    this.input = input;
    this.output = output;
  }
}
