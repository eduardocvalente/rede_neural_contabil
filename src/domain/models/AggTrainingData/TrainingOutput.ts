import { AutoMap } from '@automapper/classes';

export class TrainingOutput {
  @AutoMap()
  private output: { [key: string]: number };

  constructor() {
    this.output = {};
  }

  setOutput(key: string, value: number): void {
    this.output[key] = value;
  }

  getOutput(): { [key: string]: number } {
    return this.output;
  }
}
