// src/ui/controllers/implementations/FileUploadController.ts

import { Request, Response } from 'express';
import { IFileUploadService } from '../../../services/interfaces/IFileUploadService';
import { IFileUploadController } from '../interfaces/IFileUploadController';
import { INfeService } from '../../../services/interfaces/INfeService';
import { IEmpresaReceitaWSConsultaService } from '../../../services/interfaces/IEmpresaReceitaWSConsultaService';
import Bottleneck from 'bottleneck';
import { EmpresaReceitaWS } from '../../../domain/models/AggEmpresaReceitaWS/EmpresaReceitaWS';
import { ITrainingDataService } from '../../../services/interfaces/ITrainingDataService';
import { NfeProcDTO } from '../../../services/dto/DTONfeProc/NfeProcDTO';
import { EmpresaReceitaWSDTO } from '../../../services/dto/DTOEmpresaReceitaWS/EmpresaReceitaWSDTO';
import { inject, injectable } from 'inversify';

interface NotaInvalida {
  motivo: string;
  nota: any; // Ajuste conforme necessário
}

@injectable()
export class FileUploadController implements IFileUploadController {
  private notasInvalidas: NotaInvalida[] = []; // Armazena as notas fiscais com problemas
  private fileUploadService: IFileUploadService;
  private nfeService: INfeService;
  private trainingDataService: ITrainingDataService;
  private empresaReceitaWSConsultaService: IEmpresaReceitaWSConsultaService;
  private cnpjCache: { [cnpj: string]: EmpresaReceitaWSDTO } = {};
  private firstRequestTime: number | null = null;
  private interactionCount: number = 0;

  constructor(
    @inject('IFileUploadService') fileUploadService: IFileUploadService,
    @inject('INfeService') nfeService: INfeService,
    @inject('ITrainingDataService') trainingDataService: ITrainingDataService,
    @inject('IEmpresaReceitaWSConsultaService')
    empresaReceitaWSConsultaService: IEmpresaReceitaWSConsultaService,
  ) {
    this.fileUploadService = fileUploadService;
    this.nfeService = nfeService;
    this.trainingDataService = trainingDataService;
    this.empresaReceitaWSConsultaService = empresaReceitaWSConsultaService;
  }

  async uploadXmlFiles(req: Request, res: Response): Promise<void> {
    console.log('Upload XML chamado'); // Log para depuração
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      return;
    }

    try {
      // Processa os arquivos XML para obter os dados JSON
      const results = await this.fileUploadService.processXmlFiles(files);

      const nfeProc: NfeProcDTO[] = [];

      // Processamento individual para capturar erros específicos
      for (const result of results) {
        try {
          const dto = this.nfeService.processNfeData(result);
          nfeProc.push(dto);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erro desconhecido.';
          this.notasInvalidas.push({
            motivo: errorMessage,
            nota: result, // Armazena o JSON bruto do arquivo que causou o erro
          });
        }
      }

      // Chama a função processarNfeProc para processar os dados NfeProcDTO
      const listaNfeTrainingDataDTO: NfeProcDTO[] =
        await this.processarNfeProc(nfeProc);

      // Chama a função processarClassificacoes para adicionar classificações
      const resultClassificacoes: NfeProcDTO[] =
        await this.processarClassificacoes(listaNfeTrainingDataDTO);

      // Verifica se há notas fiscais inválidas
      if (this.notasInvalidas.length > 0) {
        // Retorna as notas processadas e também as notas inválidas
        res.json({
          message: 'Processamento concluído com erros.',
          data: resultClassificacoes,
          notasInvalidas: this.notasInvalidas, // Envia as notas inválidas para o front-end
        });
      } else {
        // Se não houver notas inválidas, retorna apenas as notas processadas
        res.json({
          message: 'Arquivos processados com sucesso',
          data: resultClassificacoes,
        });
      }
    } catch (error) {
      // Tratamento de erros durante o processamento de arquivos XML (parsing)
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido.';
      console.error(errorMessage);
      this.notasInvalidas.push({
        motivo: errorMessage,
        nota: {}, // Pode incluir informações adicionais, se necessário
      });

      // Retorna as notas processadas com erros de parsing
      res.json({
        message: 'Processamento concluído com erros.',
        data: [], // Sem dados processados com sucesso
        notasInvalidas: this.notasInvalidas,
      });
    }
  }

  private async processarNfeProc(
    nfeProcArray: NfeProcDTO[],
  ): Promise<NfeProcDTO[]> {
    const validNfeProcArray: NfeProcDTO[] = [];

    for (const nfeProcData of nfeProcArray) {
      let isValid = true;

      for (const nfe of nfeProcData.NFe) {
        for (const infNFe of nfe.infNFe) {
          // Validação do CNPJ do Emitente
          if (!infNFe.emit.CNPJ || !this.validarCNPJ(infNFe.emit.CNPJ)) {
            this.notasInvalidas.push({
              motivo: 'Emitente com CNPJ ausente ou inválido',
              nota: nfeProcData,
            });
            isValid = false;
            break;
          }

          // Validação do CNPJ do Destinatário
          if (!infNFe.dest?.CNPJ || !this.validarCNPJ(infNFe.dest.CNPJ)) {
            this.notasInvalidas.push({
              motivo: 'Destinatário com CNPJ ausente ou inválido',
              nota: nfeProcData,
            });
            isValid = false;
            break;
          }

          try {
            const emitente = await this.consultarCNPJComControle(
              infNFe.emit.CNPJ,
            );
            const destinatario = await this.consultarCNPJComControle(
              infNFe.dest.CNPJ,
            );

            nfeProcData.emitenteEmpresaReceitaWSDTO = emitente;
            nfeProcData.destinatarioEmpresaReceitaWSDTO = destinatario;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Erro desconhecido.';
            this.notasInvalidas.push({
              motivo: `Erro ao consultar CNPJ: ${errorMessage}`,
              nota: nfeProcData,
            });
            isValid = false;
            break;
          }
        }

        if (!isValid) {
          break; // Interrompe o processamento das infNFe se a nota já foi marcada como inválida
        }
      }

      if (isValid) {
        validNfeProcArray.push(nfeProcData);
      }
    }

    return validNfeProcArray;
  }

  private validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== +digitos.charAt(0)) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === +digitos.charAt(1);
  }

  private async consultarCNPJComControle(
    cnpj: string,
  ): Promise<EmpresaReceitaWSDTO> {
    if (this.cnpjCache[cnpj]) {
      return this.cnpjCache[cnpj];
    }

    const currentTime = Date.now();

    if (
      !this.firstRequestTime ||
      currentTime - this.firstRequestTime >= 65000
    ) {
      this.firstRequestTime = currentTime;
      this.interactionCount = 0;
    }

    this.interactionCount++;

    if (this.interactionCount > 3) {
      const timeElapsed = currentTime - this.firstRequestTime;
      const timeToWait = 65000 - timeElapsed;
      if (timeToWait > 0) {
        await this.delay(timeToWait);
      }

      this.interactionCount = 1;
      this.firstRequestTime = Date.now();
    }

    try {
      const resultadoConsulta =
        await this.empresaReceitaWSConsultaService.consultarCNPJ(cnpj);
      this.cnpjCache[cnpj] = resultadoConsulta;
      return resultadoConsulta;
    } catch (error: any) {
      console.error(
        'Erro ao consultar a API da ReceitaWS:',
        error.response?.data || error.message,
      );

      if (error.response) {
        // Se a API retornar um erro específico
        throw new Error(
          `Erro ao consultar o CNPJ: ${error.response.data?.message || 'Erro desconhecido na resposta da API'}`,
        );
      } else if (error.request) {
        // Se a requisição foi feita mas nenhuma resposta foi recebida
        throw new Error('Nenhuma resposta recebida da API da ReceitaWS.');
      } else {
        // Outros tipos de erros
        throw new Error(
          `Erro ao consultar o CNPJ: ${error.message || 'Erro desconhecido'}`,
        );
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async processarClassificacoes(
    listaNfeTrainingDataDTO: NfeProcDTO[],
  ): Promise<NfeProcDTO[]> {
    const validNfeProcArray: NfeProcDTO[] = [];

    for (const dto of listaNfeTrainingDataDTO) {
      try {
        const destinatarioCNAE =
          dto.destinatarioEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code;
        const emitenteCNAE =
          dto.emitenteEmpresaReceitaWSDTO?.atividadesPrincipais[0]?.code;

        if (!destinatarioCNAE || !emitenteCNAE) {
          this.notasInvalidas.push({
            motivo: 'CNAE do destinatário ou emitente não encontrado.',
            nota: dto,
          });
          continue; // Pula para a próxima nota fiscal
        }

        // Processa as classificações para cada item NCM
        await Promise.all(
          dto.NFe.flatMap((nfe) =>
            nfe.infNFe.flatMap((infNFe) =>
              infNFe.det.map(async (det) => {
                try {
                  const classificationResult =
                    await this.trainingDataService.classify(
                      destinatarioCNAE,
                      emitenteCNAE,
                      det.prod.NCM,
                    );

                  // Adiciona as classificações ao DTO
                  dto.addClassificationData(
                    classificationResult.contaDebito || 'N/A',
                    classificationResult.contaCredito || 'N/A',
                    {
                      contaDebito:
                        classificationResult.confidences?.contaDebito ?? 0, // Usa 0 como padrão
                      contaCredito:
                        classificationResult.confidences?.contaCredito ?? 0, // Usa 0 como padrão
                    },
                  );
                } catch (error) {
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : 'Erro desconhecido.';
                  console.error(
                    `Erro ao classificar NCM para o DTO ${JSON.stringify(dto)}:`,
                    error,
                  );
                  this.notasInvalidas.push({
                    motivo: `Erro ao classificar NCM: ${errorMessage}`,
                    nota: dto, // Adiciona o DTO que causou o erro
                  });
                }
              }),
            ),
          ),
        );

        // Adiciona a nota fiscal ao array de notas válidas
        validNfeProcArray.push(dto);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido.';
        console.error(
          `Erro ao classificar NCM para o DTO ${JSON.stringify(dto)}:`,
          error,
        );
        this.notasInvalidas.push({
          motivo: errorMessage,
          nota: dto, // Adiciona o DTO que causou o erro
        });
      }
    }

    return validNfeProcArray;
  }
}
