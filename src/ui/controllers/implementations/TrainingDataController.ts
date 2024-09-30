// Importações necessárias
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TrainingData } from '../../../domain/models/AggTrainingData/TrainingData';
import { TrainingInput } from '../../../domain/models/AggTrainingData/TrainingInput';
import { TrainingOutput } from '../../../domain/models/AggTrainingData/TrainingOutput';
import { ITrainingDataService } from '../../../services/interfaces/ITrainingDataService';

@injectable()
export class TrainingDataController {
  private service: ITrainingDataService;

  // Injeção de dependência via construtor
  constructor(@inject('ITrainingDataService') service: ITrainingDataService) {
    this.service = service;
  }

  /**
   * Método para classificar dados contábeis.
   * Recebe parâmetros do corpo da requisição e retorna a classificação.
   */
  public classify = async (req: Request, res: Response): Promise<void> => {
    const { cnaePrincipal, cnaeEntrada, ncmItem } = req.body;

    try {
      // Espera a classificação ser realizada pelo serviço
      const result = await this.service.classify(
        cnaePrincipal,
        cnaeEntrada,
        ncmItem,
      );
      res.json(result);
    } catch (error: any) {
      console.error('Erro na classificação:', error);
      res
        .status(500)
        .json({ error: error.message || 'Erro interno do servidor.' });
    }
  };

  /**
   * Método para receber feedback e reclassificar dados contábeis.
   * Recebe parâmetros do corpo da requisição, atualiza os dados de treinamento e retorna uma mensagem de sucesso.
   */
  public giveFeedback = async (req: Request, res: Response): Promise<void> => {
    const {
      cnaePrincipal,
      cnaeEntrada,
      ncmItem,
      correctDebitCategory,
      correctCreditCategory,
    } = req.body;

    // Validação dos campos obrigatórios
    if (
      !cnaePrincipal ||
      !cnaeEntrada ||
      !ncmItem ||
      !correctDebitCategory ||
      !correctCreditCategory
    ) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      return;
    }

    try {
      // Criação dos objetos de treinamento
      const trainingInput = new TrainingInput(
        cnaePrincipal,
        cnaeEntrada,
        ncmItem,
      );
      const trainingOutput = new TrainingOutput();
      trainingOutput.setOutput(`contaDebito_${correctDebitCategory}`, 1);
      trainingOutput.setOutput(`contaCredito_${correctCreditCategory}`, 1);
      const newTrainingData = new TrainingData(trainingInput, trainingOutput);

      // Adição dos dados de treinamento via serviço
      await this.service.addTrainingData(newTrainingData);

      res.json({ message: 'Rede neural re-treinada com sucesso.' });
    } catch (error: any) {
      console.error('Erro ao adicionar dados de treinamento:', error);
      res
        .status(500)
        .json({ error: error.message || 'Erro interno do servidor.' });
    }
  };
}
