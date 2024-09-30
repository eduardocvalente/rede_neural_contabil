import { inject, injectable } from 'inversify';
import { ITrainingDataService } from '../../services/interfaces/ITrainingDataService';
import { ITrainingDataRepository } from '../../domain/models/AggTrainingData/ITrainingDataRepository';
import { TrainingData } from '../../domain/models/AggTrainingData/TrainingData';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios'; // Para download de arquivos
import * as unzipper from 'unzipper'; // Para descompactar arquivos zip

@injectable()
export class TrainingDataService implements ITrainingDataService {
  private static instance: TrainingDataService;
  private model: tf.LayersModel | null = null;
  private repository: ITrainingDataRepository;
  private modelPath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'model',
  );
  private embeddingsPath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'embeddings',
  );
  private outputClasses: string[] = [];
  private wordIndex: { [word: string]: number } = {};
  private maxLen: number = 100; // Tamanho máximo da sequência
  private isTraining: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(
    @inject('ITrainingDataRepository') repository: ITrainingDataRepository,
  ) {
    this.repository = repository;
  }

  // Implementação do Singleton
  public static getInstance(
    repository: ITrainingDataRepository,
  ): TrainingDataService {
    if (!TrainingDataService.instance) {
      TrainingDataService.instance = new TrainingDataService(repository);
    }
    return TrainingDataService.instance;
  }

  // Método público para inicialização
  public async initialize(): Promise<void> {
    await this.initializeModel();
  }

  /**
   * Inicializa o modelo.
   */
  private async initializeModel(): Promise<void> {
    if (this.model) {
      // Modelo já está carregado na memória
      return;
    }

    if (this.initializationPromise) {
      // Já está inicializando, aguarda a conclusão
      await this.initializationPromise;
      return;
    }

    this.initializationPromise = (async () => {
      try {
        if (fs.existsSync(`${this.modelPath}/model.json`)) {
          // Carrega o modelo salvo
          this.model = await tf.loadLayersModel(
            `file://${this.modelPath}/model.json`,
          );
          console.log('Modelo carregado com sucesso do disco.');

          // Compila o modelo após carregá-lo
          this.compileModel();

          // Carrega as classes de saída e o word index
          await this.loadModelMetadata();
        } else {
          console.log(
            'Nenhum modelo existente encontrado. Treinando um novo modelo...',
          );
          // Treina o modelo se não existir
          await this.retrainNetwork();

          // Após o treinamento, carrega o modelo treinado
          this.model = await tf.loadLayersModel(
            `file://${this.modelPath}/model.json`,
          );
          console.log('Modelo treinado e carregado com sucesso.');

          // Compila o modelo após carregá-lo
          this.compileModel();

          // Carrega as classes de saída e o word index
          await this.loadModelMetadata();
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'Erro durante a inicialização do modelo:',
            error.message,
          );
        } else {
          console.error(
            'Erro desconhecido durante a inicialização do modelo:',
            error,
          );
        }
        throw error;
      } finally {
        // Garante que a promise seja limpa
        this.initializationPromise = null;
      }
    })();

    await this.initializationPromise;
  }

  /**
   * Compila o modelo com os hiperparâmetros apropriados.
   */
  private compileModel(): void {
    if (!this.model) {
      throw new Error('Modelo não está inicializado.');
    }

    // Usando o otimizador Adam
    const optimizer = tf.train.adam(0.001);

    this.model.compile({
      optimizer: optimizer,
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });
    console.log('Modelo compilado.');
  }

  /**
   * Carrega as classes de saída e o word index do disco.
   */
  private async loadModelMetadata(): Promise<void> {
    // Carrega as classes de saída
    const classesPath = path.join(this.modelPath, 'output_classes.json');
    if (fs.existsSync(classesPath)) {
      const classesData = fs.readFileSync(classesPath, 'utf8');
      this.outputClasses = JSON.parse(classesData);
      console.log('Classes de saída carregadas:', this.outputClasses);
    } else {
      console.warn(
        'Arquivo de classes de saída não encontrado. Criando novas classes de saída.',
      );
      this.updateOutputClasses();
    }

    // Carrega o mapeamento de palavras
    const wordIndexPath = path.join(this.modelPath, 'word_index.json');
    if (fs.existsSync(wordIndexPath)) {
      const wordIndexData = fs.readFileSync(wordIndexPath, 'utf8');
      this.wordIndex = JSON.parse(wordIndexData);
      console.log('Word index carregado.');
    } else {
      console.warn(
        'Arquivo de word index não encontrado. Criando um novo word index e re-treinando o modelo.',
      );
      this.updateWordIndex();

      // Re-treina e salva o modelo
      await this.trainAndSaveModel();
    }
  }

  /**
   * Verifica e baixa os embeddings pré-treinados, se necessário.
   */
  private async checkAndDownloadEmbeddings(): Promise<void> {
    const embeddingsFilePath = path.join(
      this.embeddingsPath,
      'glove.6B.100d.txt',
    );

    if (!fs.existsSync(embeddingsFilePath)) {
      console.log('Embeddings GloVe não encontrados. Tentando baixar...');
      const url = 'https://nlp.stanford.edu/data/glove.6B.zip';
      const zipPath = path.join(this.embeddingsPath, 'glove.6B.zip');

      try {
        // Cria o diretório de embeddings se não existir
        if (!fs.existsSync(this.embeddingsPath)) {
          fs.mkdirSync(this.embeddingsPath, { recursive: true });
          console.log(`Diretório criado: ${this.embeddingsPath}`);
        }

        // Tenta baixar o arquivo zip
        const writer = fs.createWriteStream(zipPath);
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'stream',
        });
        response.data.pipe(writer);

        // Aguarda o download ser concluído
        await new Promise<void>((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Descompacta o arquivo zip
        await fs
          .createReadStream(zipPath)
          .pipe(unzipper.Extract({ path: this.embeddingsPath }))
          .promise();

        // Remove o arquivo zip
        fs.unlinkSync(zipPath);
        console.log('Embeddings baixados e extraídos com sucesso.');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro ao baixar os embeddings:', error.message);
        } else {
          console.error('Erro desconhecido ao baixar os embeddings:', error);
        }
        console.error(
          'Por favor, baixe o arquivo glove.6B.100d.txt manualmente e coloque-o no diretório apropriado.',
        );
        throw new Error(
          'Não foi possível baixar os embeddings GloVe. Verifique sua conexão ou baixe o arquivo manualmente.',
        );
      }
    }
  }

  /**
   * Carrega os embeddings pré-treinados.
   */
  private async loadPretrainedEmbeddings(): Promise<tf.Tensor2D> {
    await this.checkAndDownloadEmbeddings(); // Verifica e baixa os embeddings
    const embeddingsFilePath = path.join(
      this.embeddingsPath,
      'glove.6B.100d.txt',
    );
    const embedDim = 100; // Deve corresponder à dimensão dos embeddings

    // Calcula o tamanho correto do vocabulário
    const maxIndex = Math.max(...Object.values(this.wordIndex));
    const vocabSize = maxIndex + 1;
    console.log('Máximo índice no wordIndex:', maxIndex);
    console.log('Tamanho do Vocabulário (vocabSize):', vocabSize);

    let embeddingMatrix: tf.Tensor2D;

    console.log('Carregando embeddings pré-treinados...');
    const embeddingIndex: { [word: string]: number[] } = {};

    const data = fs.readFileSync(embeddingsFilePath, 'utf8');
    const lines = data.split('\n');
    for (const line of lines) {
      const values = line.trim().split(' ');
      const word = values[0];
      const coefficients = values.slice(1).map((val) => parseFloat(val));
      embeddingIndex[word] = coefficients;
    }

    // Inicializa o buffer de embeddings com o tamanho correto
    const embeddingBuffer = tf.buffer<tf.Rank.R2>([vocabSize, embedDim]);

    for (const [word, idx] of Object.entries(this.wordIndex)) {
      const i = Number(idx); // Garante que 'i' é um número
      const embeddingVector = embeddingIndex[word];
      if (embeddingVector) {
        for (let j = 0; j < embedDim; j++) {
          embeddingBuffer.set(embeddingVector[j], i, j);
        }
      } else {
        // Inicializa com valores aleatórios se a palavra não estiver nos embeddings
        for (let j = 0; j < embedDim; j++) {
          embeddingBuffer.set(Math.random(), i, j);
        }
      }
    }

    embeddingMatrix = embeddingBuffer.toTensor();
    console.log('Embeddings pré-treinados carregados com sucesso.');

    return embeddingMatrix;
  }

  /**
   * Cria um novo modelo com o número correto de classes de saída.
   */
  private async createModel(): Promise<tf.LayersModel> {
    const numClasses = this.getOutputClassesCount();
    console.log('Número de Classes de Saída:', numClasses);

    // Parâmetros do modelo
    const vocabSize = Math.max(...Object.values(this.wordIndex)) + 1;
    console.log('Tamanho do Vocabulário (vocabSize):', vocabSize);
    const embedDim = 100; // Deve corresponder à dimensão dos embeddings GloVe

    // Carrega a matriz de embeddings pré-treinados
    const embeddingMatrix = await this.loadPretrainedEmbeddings();

    // Camada de entrada
    const inputs = tf.input({ shape: [this.maxLen], dtype: 'int32' });

    // Camada de embedding com pesos pré-treinados
    let x = tf.layers
      .embedding({
        inputDim: vocabSize,
        outputDim: embedDim,
        inputLength: this.maxLen,
        weights: [embeddingMatrix],
        trainable: true, // Ajustar os embeddings durante o treinamento
      })
      .apply(inputs) as tf.SymbolicTensor;

    // Camadas convolucionais adicionais
    x = tf.layers
      .conv1d({ filters: 256, kernelSize: 5, activation: 'relu' })
      .apply(x) as tf.SymbolicTensor;
    x = tf.layers.batchNormalization().apply(x) as tf.SymbolicTensor;
    x = tf.layers.maxPooling1d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;

    x = tf.layers
      .conv1d({ filters: 128, kernelSize: 3, activation: 'relu' })
      .apply(x) as tf.SymbolicTensor;
    x = tf.layers.batchNormalization().apply(x) as tf.SymbolicTensor;
    x = tf.layers.maxPooling1d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;

    // Camada LSTM bidirecional
    x = tf.layers
      .bidirectional({
        layer: tf.layers.lstm({ units: 64, returnSequences: false }),
        mergeMode: 'concat',
      })
      .apply(x) as tf.SymbolicTensor;

    // Camada Dropout
    x = tf.layers.dropout({ rate: 0.5 }).apply(x) as tf.SymbolicTensor;

    // Camada densa com regularização L2
    x = tf.layers
      .dense({
        units: 64,
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
      })
      .apply(x) as tf.SymbolicTensor;

    // Outra camada Dropout
    x = tf.layers.dropout({ rate: 0.5 }).apply(x) as tf.SymbolicTensor;

    // Camada densa final
    const outputs = tf.layers
      .dense({ units: numClasses, activation: 'sigmoid' })
      .apply(x) as tf.SymbolicTensor;

    // Criação do modelo
    const model = tf.model({ inputs: inputs, outputs: outputs });

    // Compilação do modelo
    this.model = model;
    this.compileModel();

    console.log('Modelo com embeddings pré-treinados criado e compilado.');
    return model;
  }

  /**
   * Vetoriza os dados de entrada usando tokenização simples.
   */
  private vectorizeInput(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): tf.Tensor {
    const text = `${cnaePrincipal} ${cnaeEntrada} ${ncm}`.toLowerCase();

    // Tokenização simples: divide por espaços e mapeia palavras para IDs
    const tokens = text.split(/\s+/);
    const sequences = tokens.map((word) => {
      const index = this.wordIndex[word];
      if (index !== undefined) {
        return index;
      } else {
        // Mapeia palavras desconhecidas para um índice especial, por exemplo, 0
        return 0;
      }
    });

    console.log('Sequências geradas para a entrada:', sequences);

    // Padroniza as sequências para o tamanho máximo
    const paddedSequences = this.padSequences([sequences], this.maxLen);

    return tf.tensor2d(paddedSequences, [1, this.maxLen], 'int32');
  }

  /**
   * Atualiza o mapeamento de palavras para índices.
   */
  private updateWordIndex(): void {
    const data = this.repository.findAll();
    const wordSet = new Set<string>();

    // Coleta todas as palavras dos dados de treinamento
    data.forEach((d) => {
      const text =
        `${d.input.cnaePrincipal} ${d.input.cnaeEntrada} ${d.input.ncm}`.toLowerCase();
      text.split(/\s+/).forEach((word) => wordSet.add(word));
    });

    // Cria o mapeamento palavra -> índice
    const wordIndex: { [word: string]: number } = {};
    Array.from(wordSet).forEach((word, index) => {
      wordIndex[word] = index; // Índice começa em 0 agora
    });

    this.wordIndex = wordIndex;

    // Loga os índices para verificação
    console.log('Word index atualizado:', this.wordIndex);

    // Salva o word index atualizado
    const wordIndexPath = path.join(this.modelPath, 'word_index.json');
    const dir = path.dirname(wordIndexPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Diretório criado: ${dir}`);
    }

    fs.writeFileSync(wordIndexPath, JSON.stringify(this.wordIndex), 'utf8');
    console.log('Word index atualizado e salvo.');
  }

  /**
   * Atualiza as classes de saída com base nos dados.
   */
  private updateOutputClasses(): void {
    const data = this.repository.findAll();
    const classesSet = new Set<string>();

    data.forEach((d) => {
      Object.keys(d.output.getOutput()).forEach((key) => classesSet.add(key));
    });

    this.outputClasses = Array.from(classesSet);
    console.log('Classes de saída atualizadas:', this.outputClasses);

    // Salva as classes de saída atualizadas
    const classesPath = path.join(this.modelPath, 'output_classes.json');
    const dir = path.dirname(classesPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Diretório criado: ${dir}`);
    }

    fs.writeFileSync(classesPath, JSON.stringify(this.outputClasses), 'utf8');
    console.log('Classes de saída salvas.');
  }

  /**
   * Padroniza as sequências para um comprimento fixo.
   */
  private padSequences(sequences: number[][], maxLen: number): number[][] {
    return sequences.map((seq) => {
      if (seq.length > maxLen) {
        return seq.slice(0, maxLen);
      } else {
        return [...seq, ...new Array(maxLen - seq.length).fill(0)];
      }
    });
  }

  /**
   * Prepara os dados de treinamento.
   */
  private async prepareTrainingData(): Promise<{
    inputs: tf.Tensor;
    outputs: tf.Tensor;
  }> {
    const data = this.repository.findAll();
    const inputs = [];
    const outputs = [];

    for (const d of data) {
      // Data augmentation simples
      const augmentedTexts = this.augmentText(
        d.input.cnaePrincipal,
        d.input.cnaeEntrada,
        d.input.ncm,
      );

      for (const text of augmentedTexts) {
        const inputTensor = this.vectorizeText(text);
        inputs.push(inputTensor);

        // Inicializa um vetor de zeros para as labels
        const outputLabel = new Array(this.outputClasses.length).fill(0);

        // Obtém as chaves de saída
        const outputKeys = Object.keys(d.output.getOutput());

        // Marca as classes presentes com 1
        outputKeys.forEach((key) => {
          const classIndex = this.outputClasses.indexOf(key);
          if (classIndex >= 0) {
            outputLabel[classIndex] = 1;
          }
        });

        outputs.push(outputLabel);
      }
    }

    // Concatena os tensores de entrada
    const inputsTensor = tf.concat(inputs, 0);

    // Cria um tensor 2D para as labels
    const outputsTensor = tf.tensor2d(outputs, [
      outputs.length,
      this.outputClasses.length,
    ]);

    return { inputs: inputsTensor, outputs: outputsTensor };
  }

  /**
   * Vetoriza um texto individual.
   */
  private vectorizeText(text: string): tf.Tensor {
    const tokens = text.toLowerCase().split(/\s+/);
    const sequences = tokens.map((word) => {
      const index = this.wordIndex[word];
      if (index !== undefined) {
        return index;
      } else {
        // Mapeia palavras desconhecidas para um índice especial, por exemplo, 0
        return 0;
      }
    });

    console.log('Sequências geradas para o texto:', sequences);

    const paddedSequences = this.padSequences([sequences], this.maxLen);
    return tf.tensor2d(paddedSequences, [1, this.maxLen], 'int32');
  }

  /**
   * Aumenta o texto utilizando técnicas de data augmentation.
   */
  private augmentText(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): string[] {
    const texts = [];

    // Texto original
    texts.push(`${cnaePrincipal} ${cnaeEntrada} ${ncm}`);

    // Exemplo de data augmentation: inversão de cnaePrincipal e cnaeEntrada
    texts.push(`${cnaeEntrada} ${cnaePrincipal} ${ncm}`);

    // Você pode adicionar mais técnicas de data augmentation aqui

    return texts;
  }

  /**
   * Retorna o número de classes de saída.
   */
  private getOutputClassesCount(): number {
    return this.outputClasses.length;
  }

  /**
   * Treina e salva o modelo.
   */
  private async trainAndSaveModel(): Promise<void> {
    if (this.isTraining) {
      console.log('Treinamento já está em andamento. Aguardando conclusão.');
      // Aguarda a conclusão do treinamento atual
      while (this.isTraining) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return; // Após o treinamento atual concluir, não inicia outro
    }

    this.isTraining = true;

    try {
      const numClasses = this.getOutputClassesCount();

      // Recria o modelo sempre que o wordIndex ou outputClasses são atualizados
      console.log('Recriando o modelo com os dados atualizados.');
      this.model = await this.createModel();

      // Compila o modelo antes de treiná-lo
      this.compileModel();

      const { inputs, outputs } = await this.prepareTrainingData();

      console.log('Forma do Tensor de Entrada:', inputs.shape);
      console.log('Forma do Tensor de Saída:', outputs.shape);

      // Cria o diretório do modelo se não existir
      if (!fs.existsSync(this.modelPath)) {
        fs.mkdirSync(this.modelPath, { recursive: true });
        console.log(`Diretório do modelo criado: ${this.modelPath}`);
      }

      // Treina o modelo
      await this.model.fit(inputs, outputs, {
        epochs: 50,
        batchSize: 16,
        validationSplit: 0.2,
        callbacks: [
          tf.callbacks.earlyStopping({
            monitor: 'val_loss',
            patience: 5,
          }),
        ],
      });

      // Salva o modelo
      await this.model.save(`file://${this.modelPath}`);
      console.log('Modelo treinado e salvo com sucesso.');

      // Recarrega o modelo para garantir que `this.model` esteja sincronizado
      this.model = await tf.loadLayersModel(
        `file://${this.modelPath}/model.json`,
      );
      console.log('Modelo recarregado após salvamento.');

      // Compila o modelo após recarregá-lo
      this.compileModel();

      // Salva as classes de saída e o word index
      this.updateOutputClasses();
      this.updateWordIndex();
    } catch (error) {
      console.error(
        'Erro durante o treinamento e salvamento do modelo:',
        error,
      );
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * Adiciona novos dados de treinamento e re-treina o modelo.
   */
  async addTrainingData(input: TrainingData): Promise<void> {
    this.repository.save(input);
    // Atualiza as classes de saída e o mapeamento de palavras
    this.updateOutputClasses();
    this.updateWordIndex();
    await this.trainAndSaveModel();
    console.log('Novo dado de treinamento adicionado e modelo re-treinado.');
  }

  /**
   * Re-treina a rede neural com todos os dados.
   */
  async retrainNetwork(): Promise<void> {
    // Atualiza as classes de saída e o mapeamento de palavras
    this.updateOutputClasses();
    this.updateWordIndex();
    await this.trainAndSaveModel();
    console.log('Modelo re-treinado com todos os dados.');
  }

  /**
   * Classifica os dados de entrada.
   */
  async classify(
    cnaePrincipal: string,
    cnaeEntrada: string,
    ncm: string,
  ): Promise<{
    contaDebito: string | null;
    contaCredito: string | null;
    confidences: { contaDebito: number; contaCredito: number };
  }> {
    try {
      // Garante que o modelo está inicializado
      await this.initializeModel();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao inicializar o modelo:', error.message);
        throw new Error(
          'Não foi possível inicializar o modelo. Certifique-se de que ele foi treinado.',
        );
      } else {
        console.error('Erro desconhecido ao inicializar o modelo:', error);
        throw new Error('Erro desconhecido ao inicializar o modelo.');
      }
    }

    // Verifica novamente se o modelo foi carregado
    if (!this.model) {
      throw new Error(
        'O modelo não está inicializado. Por favor, treine o modelo antes de classificá-lo.',
      );
    }

    // Não atualiza o wordIndex durante a inferência
    if (Object.keys(this.wordIndex).length === 0) {
      throw new Error(
        'Word index não está carregado. Por favor, treine o modelo antes de classificá-lo.',
      );
    }

    const inputTensor = this.vectorizeInput(cnaePrincipal, cnaeEntrada, ncm);

    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const probabilities = prediction.dataSync() as Float32Array;

    let contaDebito: string | null = null;
    let contaCredito: string | null = null;
    let confidenceDebito = 0;
    let confidenceCredito = 0;

    // Itera sobre as probabilidades para identificar as classes com maior probabilidade
    for (let i = 0; i < probabilities.length; i++) {
      const className = this.outputClasses[i];
      const probability = probabilities[i];

      console.log(`Classe: ${className}, Probabilidade: ${probability}`);

      if (className.startsWith('contaDebito_')) {
        if (probability > confidenceDebito) {
          contaDebito = className.replace('contaDebito_', '');
          confidenceDebito = probability;
        }
      } else if (className.startsWith('contaCredito_')) {
        if (probability > confidenceCredito) {
          contaCredito = className.replace('contaCredito_', '');
          confidenceCredito = probability;
        }
      }
    }

    return {
      contaDebito,
      contaCredito,
      confidences: {
        contaDebito: confidenceDebito,
        contaCredito: confidenceCredito,
      },
    };
  }

  /**
   * Obtém todos os dados de treinamento.
   */
  async getAll(): Promise<TrainingData[]> {
    return this.repository.findAll();
  }
}
