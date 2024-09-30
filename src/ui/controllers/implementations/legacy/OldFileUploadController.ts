// src/ui/controllers/implementations/FileUploadController.ts

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify/lib/inversify';
import { IFileUploadService } from '../../../../services/interfaces/IFileUploadService';
import { IFileUploadController } from '../../interfaces/IFileUploadController';
import { INfeService } from '../../../../services/interfaces/INfeService';
import { NfeProc } from '../../../../domain/models/AggNfeProc/NfeProc';
import { NFe } from '../../../../domain/models/AggNfeProc/NFe';
import { InfNFe } from '../../../../domain/models/AggNfeProc/InfNFe';
import { Det } from '../../../../domain/models/AggNfeProc/Det';
import { IEmpresaReceitaWSConsultaService } from '../../../../services/interfaces/IEmpresaReceitaWSConsultaService';
import { NfeTrainingDataDTO } from '../../../dto/NfeTrainingDataDTO';
import { EmpresaReceitaWS } from '../../../../domain/models/AggEmpresaReceitaWS/EmpresaReceitaWS';
import { ITrainingDataService } from '../../../../services/interfaces/ITrainingDataService';

@injectable()
export class FileUploadController implements IFileUploadController {
    private notasInvalidas: { motivo: string, nota: NfeProc }[] = []; // Armazena as notas fiscais com problemas

    constructor(
        @inject('IFileUploadService') private fileUploadService: IFileUploadService,
        @inject('INfeService') private nfeService: INfeService,
        @inject('ITrainingDataService') private trainingDataService: ITrainingDataService,
        @inject('IEmpresaReceitaWSConsultaService') private empresaReceitaWSConsultaService: IEmpresaReceitaWSConsultaService // Corrigido aqui
    ) { }

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

            // Usa o serviço de NFe para processar os dados JSON gerados
            const nfeProc: NfeProc[] = results.map((result): NfeProc => this.nfeService.processNfeData(result));

            // Chama a função processarNfeProc para processar os dados NfeProc
            let listaNfeTrainingDataDTO: NfeTrainingDataDTO[] = await this.processarNfeProc(nfeProc);

            //Resltados na pesquisa da rede neural.
            const result = await Promise.all(
                listaNfeTrainingDataDTO.flatMap(async dto => {
                    return Promise.all(
                        dto.ncmItem.map(async ncm => {
                            // Chama o método de classificação para cada NCM individualmente
                            const classificationResult = await this.trainingDataService.classify(dto.cnaePrincipal, dto.cnaeEntrada, ncm);
                            
                            // Retorna o objeto completo com contaDebito, contaCredito e confidences para cada NCM
                            return {
                                contaDebito: classificationResult.contaDebito,
                                contaCredito: classificationResult.contaCredito,
                                confidences: classificationResult.confidences
                            };
                        })
                    );
                })
            );
            

            // Verifica se há notas fiscais inválidas
            if (this.notasInvalidas.length > 0) {
                // Retorna as notas processadas e também as notas inválidas
                res.json({
                    message: 'Processamento concluído com erros.',
                    data: nfeProc,
                    notasInvalidas: this.notasInvalidas // Envia as notas inválidas para o front-end
                });
            } else {
                // Se não houver notas inválidas, retorna apenas as notas processadas
                res.json({
                    message: 'Arquivos processados com sucesso',
                    data: nfeProc
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
            console.error(errorMessage);
            res.status(500).json({ error: errorMessage });
        }
    }

    private async processarNfeProc(nfeProcArray: NfeProc[]): Promise<NfeTrainingDataDTO[]> {
        const trainingData: NfeTrainingDataDTO[] = [];
        const cnpjCache: { [cnpj: string]: EmpresaReceitaWS } = {};
        let interactionCount = 0;
        let firstRequestTime: number | null = null;

        // Função para validar CNPJ
        const validarCNPJ = (cnpj: string): boolean => {
            if (!cnpj) return false;
            cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove qualquer caractere que não seja número
            if (cnpj.length !== 14) return false;

            // Validação de sequência (para evitar CNPJs como '11111111111111')
            if (/^(\d)\1+$/.test(cnpj)) return false;

            // Validação dos dígitos verificadores
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
        };

        // Função auxiliar para gerenciar as requisições e pausas
        const consultarCNPJComControle = async (cnpj: string): Promise<EmpresaReceitaWS> => {
            /*if (!validarCNPJ(cnpj)) {
                throw new Error(`CNPJ inválido: ${cnpj}`);
            }*/

            if (cnpjCache[cnpj]) {
                // Se o CNPJ já foi consultado, retorna do cache
                return cnpjCache[cnpj];
            }

            const currentTime = Date.now();
            // Se é a primeira requisição ou se passou mais de 1 minuto e 5 segundos desde a última requisição    
            if (!firstRequestTime || currentTime - firstRequestTime >= 65000) {
                // Reinicia o contador e o tempo da primeira requisição
                firstRequestTime = currentTime;
                interactionCount = 0;
            }

            // Aumenta o contador de interações
            interactionCount++;

            // Verifica se já foram feitas 3 requisições em menos de 1 minuto e 5 segundos
            if (interactionCount > 3) {
                const timeElapsed = currentTime - firstRequestTime;
                const timeToWait = 65000 - timeElapsed; // 1 minuto e 5 segundos (em ms) 

                // Se ainda não passou 1 minuto e 5 segundos, espera
                if (timeToWait > 0) {
                    await this.delay(timeToWait);
                }

                // Reinicia o contador de interações e o tempo da primeira requisição
                interactionCount = 1;
                firstRequestTime = Date.now();
            }

            // Faz a consulta da API e armazena o resultado no cache
            const resultadoConsulta = await this.empresaReceitaWSConsultaService.consultarCNPJ(cnpj);
            cnpjCache[cnpj] = resultadoConsulta;

            return resultadoConsulta;
        };

        // Processa as notas fiscais
        for (const nfeProcData of nfeProcArray) {
            for (const nfe of nfeProcData.NFe) {
                for (const infNFe of nfe.infNFe) {
                    // Verifica se o CNPJ do emitente está ausente ou inválido
                    if (!infNFe.emit.CNPJ || !validarCNPJ(infNFe.emit.CNPJ)) {
                        this.notasInvalidas.push({ motivo: 'Emitente com CNPJ ausente ou inválido', nota: nfeProcData });
                        continue; // Pula para a próxima iteração
                    }

                    // Verifica se o CNPJ do destinatário está ausente ou inválido
                    if (!infNFe.dest?.CNPJ || !validarCNPJ(infNFe.dest.CNPJ)) {
                        this.notasInvalidas.push({ motivo: 'Destinatário com CNPJ ausente ou inválido', nota: nfeProcData });
                        continue; // Pula para a próxima iteração
                    }

                    // Consulta o emitente e destinatário com controle de CNPJ
                    let emitente: EmpresaReceitaWS = await consultarCNPJComControle(infNFe.emit.CNPJ);
                    const destinatario: EmpresaReceitaWS = await consultarCNPJComControle(infNFe.dest.CNPJ);

                    let listaNCM: string[] = [];
                    for (const det of infNFe.det) {
                        listaNCM.push(det.prod.NCM);
                    }

                    // Cria uma nova instância de NfeTrainingDataDTO e adiciona ao array
                    const trainingDataDTO = new NfeTrainingDataDTO(
                        emitente.atividadesPrincipais[0]?.code, // cnaePrincipal (exemplo)
                        destinatario.atividadesPrincipais[0]?.code, // cnaeEntrada (exemplo)
                        listaNCM // ncmItem (lista de NCMs)
                    );

                    // Adiciona o DTO ao array de dados de treinamento
                    trainingData.push(trainingDataDTO);
                }
            }
        }

        return trainingData;
    }

    // Função de atraso
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}
