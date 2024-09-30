import { AutoMap } from '@automapper/classes';
import { TrainingInputDTO } from './TrainingInputDTO';
import { TrainingOutputDTO } from './TrainingOutputDTO';

export class TrainingDataDTO {
    @AutoMap(() => TrainingInputDTO)
    public input: TrainingInputDTO;

    @AutoMap(() => TrainingOutputDTO)
    public output: TrainingOutputDTO;

    constructor(input: TrainingInputDTO, output: TrainingOutputDTO) {
        this.input = input;
        this.output = output;
    }
}
