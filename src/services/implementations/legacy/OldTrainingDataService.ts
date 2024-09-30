// src/services/implementations/TrainingDataService.ts

import { inject, injectable } from 'inversify';
import { ITrainingDataService } from '../../services/interfaces/ITrainingDataService';
import { ITrainingDataRepository } from '../../domain/models/AggTrainingData/ITrainingDataRepository';
import { TrainingData } from '../../domain/models/AggTrainingData/TrainingData';
import * as brain from 'brain.js';
import * as natural from 'natural';
import * as fs from 'fs'; // Usando métodos síncronos
import * as path from 'path';

type InputType = number[];
type OutputType = Record<string, number>;

@injectable()
export class TrainingDataService implements ITrainingDataService {
  private network: brain.NeuralNetwork<InputType, OutputType>;
  private repository: ITrainingDataRepository;
  private modelPath: string = path.resolve(__dirname, 'model.json'); // Caminho absoluto para evitar problemas de diretório
  private isTraining: boolean = false; // Flag para evitar múltiplas operações de treinamento simultâneas
  private lastModelLoadTime: number = 0; // Para otimização de recarregamento

  constructor(
    @inject('ITrainingDataRepository') repository: ITrainingDataRepository,
  ) {
    this.repository = repository;
    this.network = new brain.NeuralNetwork<InputType, OutputType>({
      activation: 'leaky-relu', // Ativação ainda apropriada para evitar saturação
      hiddenLayers: [50, 40, 30], // Menos camadas e neurônios para reduzir a complexidade
      learningRate: 0.03, // Taxa de aprendizado balanceada
    });
    this.initializeNetwork(); // Inicialização síncrona
  }

  /**
   * Inicializa a rede neural carregando o modelo existente ou treinando um novo.
   * Esta versão é síncrona para garantir que a rede esteja pronta antes de ser usada.
   */
  private initializeNetwork(): void {
    try {
      const exists = this.fileExists(this.modelPath);
      if (exists) {
        const savedModel = fs.readFileSync(this.modelPath, 'utf8');
        const parsedModel = JSON.parse(savedModel);
        this.network.fromJSON(parsedModel);
        console.log('Modelo carregado com sucesso do arquivo model.json.');

        // Verifica e loga o outputLookup, se aplicável
        if ('outputLookup' in parsedModel) {
          console.log(
            'Output Lookup do Modelo Carregado:',
            JSON.stringify(parsedModel.outputLookup, null, 2),
          );
        } else {
          console.log('Output Lookup não encontrado no modelo carregado.');
        }

        // Atualiza o último tempo de carga
        const stats = fs.statSync(this.modelPath);
        this.lastModelLoadTime = stats.mtimeMs;
      } else {
        console.log(
          'Arquivo model.json não encontrado. Iniciando treinamento inicial...',
        );
        this.trainAndSaveNetwork(); // Treinamento síncrono
      }
    } catch (error) {
      console.error('Erro ao inicializar a rede neural:', error);
      throw error;
    }
  }

  /**
   * Verifica se um arquivo existe de forma síncrona.
   * @param path Caminho do arquivo.
   */
  private fileExists(path: string): boolean {
    try {
      fs.accessSync(path, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Vetoriza a entrada utilizando one-hot encoding simplificado.
   * @param cnaePrincipal CNAE Principal.
   * @param cnaeEntrada CNAE de Entrada.
   * @param ncm NCM.
   */
  private vectorizeInput(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): number[] {
    // Combine os valores
    const combinedString =
      `${cnaePrincipal} ${cnaeEntrada} ${ncm}`.toLowerCase();

    // Tokenize
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(combinedString);

    // One-hot encoding simplificado para cada token
    const vector: number[] = [];
    tokens.forEach((token) => {
      for (let i = 0; i < 26; i++) {
        // Considerando apenas letras a-z
        const char = String.fromCharCode(97 + i); // a=97, b=98, ..., z=122
        vector.push(token.includes(char) ? 1 : 0);
      }
    });

    // Pad ou trunca o vetor para um tamanho fixo
    const fixedLength = 78; // 3 tokens * 26 letras
    const outputVector = new Array(fixedLength).fill(0);
    for (let i = 0; i < Math.min(vector.length, fixedLength); i++) {
      outputVector[i] = vector[i];
    }

    return outputVector;
  }

  /**
   * Prepara os dados de treinamento.
   * @param data Array de TrainingData.
   */
  private prepareTrainingData(
    data: TrainingData[],
  ): { input: InputType; output: OutputType }[] {
    return data.map((d) => ({
      input: this.vectorizeInput(
        d.input.cnaePrincipal,
        d.input.cnaeEntrada,
        d.input.ncm,
      ),
      output: d.output.getOutput(),
    }));
  }

  /**
   * Treina a rede neural com os dados de treinamento e salva o modelo.
   * Esta versão é síncrona para garantir que o modelo seja salvo e recarregado corretamente.
   */
  private trainAndSaveNetwork(): void {
    if (this.isTraining) {
      console.warn('Treinamento já em andamento.');
      return;
    }
    this.isTraining = true;
    try {
      const trainingData = this.repository.findAll();
      const preparedData = this.prepareTrainingData(trainingData);

      // Recria a rede neural para ajustar a arquitetura
      this.network = new brain.NeuralNetwork<InputType, OutputType>({
        activation: 'leaky-relu', // Ativação ainda apropriada para evitar saturação
        hiddenLayers: [50, 40, 30], // Menos camadas e neurônios para reduzir a complexidade
        learningRate: 0.03, // Taxa de aprendizado balanceada
      });

      console.log(
        `Iniciando treinamento com ${preparedData.length} exemplos...`,
      );

      this.network.train(preparedData, {
        iterations: 10000, // Aumente ou diminua as iterações conforme necessário
        log: true,
        logPeriod: 100,
        errorThresh: 0.005, // Defina o limite de erro
        learningRate: 0.03, // Taxa de aprendizado balanceada
      });

      fs.writeFileSync(
        this.modelPath,
        JSON.stringify(this.network.toJSON(), null, 2),
        'utf8',
      );
      console.log('Modelo treinado e salvo com sucesso.');
      console.log(
        'Output Lookup após o treinamento:',
        this.network.toJSON().outputLookup,
      );

      // Recarrega o modelo para garantir que a rede em memória esteja atualizada
      const savedModel = fs.readFileSync(this.modelPath, 'utf8');
      const parsedModel = JSON.parse(savedModel);
      this.network.fromJSON(parsedModel);
      console.log('Rede neural em memória recarregada com o novo modelo.');
    } catch (error) {
      console.error('Erro durante o treinamento da rede neural:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * Avalia a precisão do modelo nos dados de treinamento.
   * @param data Dados de treinamento.
   */
  private evaluateAccuracy(
    data: { input: InputType; output: OutputType }[],
  ): number {
    let correct = 0;
    data.forEach((d) => {
      const output = this.network.run(d.input);
      const predicted = this.getPrediction(output);
      const actual = this.getPrediction(d.output);

      if (
        predicted.contaDebito === actual.contaDebito &&
        predicted.contaCredito === actual.contaCredito
      ) {
        correct += 1;
      }
    });

    return correct / data.length;
  }

  /**
   * Obtém a previsão a partir da saída da rede neural.
   * @param output Saída da rede neural.
   */
  private getPrediction(output: OutputType): {
    contaDebito: string | null;
    contaCredito: string | null;
  } {
    let contaDebito: string | null = null;
    let contaCredito: string | null = null;
    let maxDebitoConfidence = Number.NEGATIVE_INFINITY;
    let maxCreditoConfidence = Number.NEGATIVE_INFINITY;

    for (const [key, value] of Object.entries(output)) {
      const numericValue = Math.max(0, value as number); // Garantir valores não negativos

      if (
        key.startsWith('contaDebito_') &&
        numericValue > maxDebitoConfidence
      ) {
        maxDebitoConfidence = numericValue;
        contaDebito = key.replace('contaDebito_', '');
      }
      if (
        key.startsWith('contaCredito_') &&
        numericValue > maxCreditoConfidence
      ) {
        maxCreditoConfidence = numericValue;
        contaCredito = key.replace('contaCredito_', '');
      }
    }

    return { contaDebito, contaCredito };
  }

  /**
   * Adiciona novos dados de treinamento e treina a rede neural de forma incremental.
   * Esta versão utiliza os métodos síncronos definidos na interface.
   * @param input Novo TrainingData.
   */
  async addTrainingData(input: TrainingData): Promise<void> {
    try {
      // Salva o novo dado de treinamento e treina a rede inicialmente
      this.repository.save(input);
      this.trainAndSaveNetwork();
      console.log(
        'Novo dado de treinamento salvo e rede treinada inicialmente.',
      );

      const cnaePrincipal = input.input.cnaePrincipal;
      const cnaeEntrada = input.input.cnaeEntrada;
      const ncm = input.input.ncm;

      let confidenceDebito = 0;
      let confidenceCredito = 0;
      const desiredConfidence = 0.9; // Precisão desejada (90%)
      const maxIterations = 10000; // Limite de iterações
      let iterations = 0;

      // Função auxiliar para calcular as confianças de débito e crédito
      const calculateConfidence = (output: any) => {
        let maxDebitoConfidence = Number.NEGATIVE_INFINITY;
        let maxCreditoConfidence = Number.NEGATIVE_INFINITY;

        for (const [key, value] of Object.entries(output)) {
          const numericValue = Math.max(0, value as number); // Garante valores não negativos

          if (
            key.startsWith('contaDebito_') &&
            numericValue > maxDebitoConfidence
          ) {
            maxDebitoConfidence = numericValue;
          }

          if (
            key.startsWith('contaCredito_') &&
            numericValue > maxCreditoConfidence
          ) {
            maxCreditoConfidence = numericValue;
          }
        }

        return { maxDebitoConfidence, maxCreditoConfidence };
      };

      // Loop até atingir a confiança desejada ou o limite de iterações
      while (
        Math.min(confidenceDebito, confidenceCredito) < desiredConfidence &&
        iterations < maxIterations
      ) {
        iterations++;

        // Recarrega o modelo e executa a rede neural para o novo dado de treinamento
        const output = await this.reloadAndRunModel(
          cnaePrincipal,
          cnaeEntrada,
          ncm,
        );
        const { maxDebitoConfidence, maxCreditoConfidence } =
          calculateConfidence(output);

        confidenceDebito = maxDebitoConfidence;
        confidenceCredito = maxCreditoConfidence;

        console.log(
          `Iteração ${iterations}: Confiança do débito: ${(confidenceDebito * 100).toFixed(2)}%, Confiança do crédito: ${(confidenceCredito * 100).toFixed(2)}%`,
        );

        // Se a confiança for menor que 90%, re-treina a rede e re-insere o dado
        if (Math.min(confidenceDebito, confidenceCredito) < desiredConfidence) {
          console.log(
            'Confiança abaixo de 90%, re-treinando a rede e re-inserindo o dado...',
          );
          this.repository.save(input); // Insere o dado novamente
          this.trainAndSaveNetwork(); // Re-treina a rede neural
        }
      }

      // Verifica se a confiança desejada foi alcançada
      if (Math.min(confidenceDebito, confidenceCredito) >= desiredConfidence) {
        console.log(
          `Confiança desejada de 90% alcançada após ${iterations} iterações.`,
        );
      } else {
        console.log(
          `Não foi possível atingir a confiança de 90% após ${iterations} iterações.`,
        );
      }
    } catch (error) {
      console.error('Erro ao adicionar dados de treinamento:', error);
      throw error;
    }
  }

  /**
   * Re-treina a rede neural com todos os dados de treinamento.
   */
  async retrainNetwork(): Promise<void> {
    this.trainAndSaveNetwork();
  }

  /**
   * Obtém todos os dados de treinamento.
   */
  async getAll(): Promise<TrainingData[]> {
    return this.repository.findAll();
  }

  /**
   * Classifica a entrada e retorna as contas de débito e crédito com confiança.
   * @param cnaePrincipal CNAE Principal.
   * @param cnaeEntrada CNAE de Entrada.
   * @param ncm NCM.
   */
  classify(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): {
    contaDebito: string | null;
    contaCredito: string | null;
    confidences: { contaDebito: number; contaCredito: number };
  } {
    // Recarrega o modelo do arquivo model.json
    if (fs.existsSync(this.modelPath)) {
      try {
        const savedNetwork = JSON.parse(
          fs.readFileSync(this.modelPath, 'utf8'),
        );
        this.network.fromJSON(savedNetwork);

        console.log(
          'Modelo Neural Carregado do Arquivo:',
          JSON.stringify(savedNetwork, null, 2),
        );
        if (savedNetwork.outputLookup) {
          console.log(
            'Output Lookup do Modelo Carregado:',
            JSON.stringify(savedNetwork.outputLookup, null, 2),
          );
        } else {
          console.log('Output Lookup não encontrado no modelo carregado.');
        }
      } catch (error) {
        console.error('Erro ao recarregar o modelo neural:', error);
        throw new Error('Falha ao recarregar o modelo neural.');
      }
    } else {
      console.error('Erro: Arquivo model.json não encontrado.');
      throw new Error('Arquivo model.json não encontrado.');
    }

    if (!this.network) {
      console.error('Erro: Rede neural não está inicializada.');
      throw new Error('Rede neural não está inicializada.');
    }

    const vectorizedInput = this.vectorizeInput(
      cnaePrincipal,
      cnaeEntrada,
      ncm,
    );

    // Executa a rede neural
    const output = this.network.run(vectorizedInput);

    console.log('Saída da Rede Neural:', output); // Log para depuração

    let contaDebito: string | null = null;
    let contaCredito: string | null = null;
    let maxDebitoConfidence = Number.NEGATIVE_INFINITY;
    let maxCreditoConfidence = Number.NEGATIVE_INFINITY;

    for (const [key, value] of Object.entries(output)) {
      const numericValue = Math.max(0, value as number); // Garantir valores não negativos

      if (
        key.startsWith('contaDebito_') &&
        numericValue > maxDebitoConfidence
      ) {
        maxDebitoConfidence = numericValue;
        contaDebito = key.replace('contaDebito_', '');
      }
      if (
        key.startsWith('contaCredito_') &&
        numericValue > maxCreditoConfidence
      ) {
        maxCreditoConfidence = numericValue;
        contaCredito = key.replace('contaCredito_', '');
      }
    }

    // Garantir que a confiança não exceda 1 (100%)
    maxDebitoConfidence = Math.min(maxDebitoConfidence, 1);
    maxCreditoConfidence = Math.min(maxCreditoConfidence, 1);

    return {
      contaDebito,
      contaCredito,
      confidences: {
        contaDebito: maxDebitoConfidence,
        contaCredito: maxCreditoConfidence,
      },
    };
  }

  private async reloadAndRunModel(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): Promise<OutputType> {
    try {
      // Recarrega o modelo do arquivo model.json
      if (fs.existsSync(this.modelPath)) {
        const savedNetwork = JSON.parse(
          fs.readFileSync(this.modelPath, 'utf8'),
        );
        this.network.fromJSON(savedNetwork);

        console.log(
          'Modelo Neural Carregado do Arquivo:',
          JSON.stringify(savedNetwork, null, 2),
        );

        if (savedNetwork.outputLookup) {
          console.log(
            'Output Lookup do Modelo Carregado:',
            JSON.stringify(savedNetwork.outputLookup, null, 2),
          );
        } else {
          console.log('Output Lookup não encontrado no modelo carregado.');
        }
      } else {
        console.error('Erro: Arquivo model.json não encontrado.');
        throw new Error('Arquivo model.json não encontrado.');
      }

      if (!this.network) {
        console.error('Erro: Rede neural não está inicializada.');
        throw new Error('Rede neural não está inicializada.');
      }

      // Vetoriza a entrada
      const vectorizedInput = this.vectorizeInput(
        cnaePrincipal,
        cnaeEntrada,
        ncm,
      );

      // Executa a rede neural com a entrada vetorizada
      const output = this.network.run(vectorizedInput);
      console.log('Saída da Rede Neural:', output);

      return output;
    } catch (error) {
      console.error(
        'Erro ao recarregar o modelo neural ou executar a rede:',
        error,
      );
      throw new Error(
        'Falha ao recarregar o modelo neural ou executar a rede.',
      );
    }
  }
}
