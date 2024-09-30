// src/domain/models/AggTrainingData/FileSystemTrainingDataRepository.ts

import { ITrainingDataRepository } from './ITrainingDataRepository';
import { TrainingData } from './TrainingData';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { TrainingInput } from './TrainingInput';
import { TrainingOutput } from './TrainingOutput';

@injectable()
export class FileSystemTrainingDataRepository
  implements ITrainingDataRepository
{
  private readonly filePath = 'uploads/trainingData.json';
  private trainingData: TrainingData[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

      // Adicione logs para inspecionar os dados lidos do arquivo
      console.log('Data from file:', data);

      this.trainingData = data.map(
        (item: any) =>
          new TrainingData(
            new TrainingInput(
              item.input.cnaePrincipal,
              item.input.cnaeEntrada,
              item.input.ncm,
            ),
            Object.assign(new TrainingOutput(), { output: item.output }),
          ),
      );
    } else {
      // Inicialize com exemplos de treinamento que têm apenas um output ativo cada
      this.trainingData = [
        new TrainingData(
          new TrainingInput('0111-3/01', '0111-3/02', '0101.21.00'),
          (() => {
            const output = new TrainingOutput();
            output.setOutput('contaDebito_1.1.1.01', 1);
            output.setOutput(`contaCredito_2.1.1.01`, 1);
            return output;
          })(),
        ),
        new TrainingData(
          new TrainingInput('0112-1/01', '0112-1/02', '0101.29.00'),
          (() => {
            const output = new TrainingOutput();
            output.setOutput('contaDebito_1.1.1.01', 1);
            output.setOutput(`contaCredito_2.1.1.01`, 1);
            // Apenas um output ativo por exemplo
            return output;
          })(),
        ),
      ];
      this.saveToFile(); // Salve os dados iniciais
    }
  }

  private saveToFile(): void {
    const formattedData = this.trainingData.map((data) => ({
      input: {
        cnaePrincipal: data.input.cnaePrincipal,
        cnaeEntrada: data.input.cnaeEntrada,
        ncm: data.input.ncm,
      },
      output: data.output.getOutput(),
    }));
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(formattedData, null, 2),
      'utf8',
    );
  }

  findAll(): TrainingData[] {
    return this.trainingData;
  }

  save(trainingData: TrainingData): void {
    this.trainingData.push(trainingData);
    this.saveToFile();
  }

  saveAll(trainingData: TrainingData[]): void {
    this.trainingData = trainingData;
    this.saveToFile();
  }
}
