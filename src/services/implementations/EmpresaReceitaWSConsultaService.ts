import { IEmpresaReceitaWSConsultaService } from '../interfaces/IEmpresaReceitaWSConsultaService';
import { EmpresaReceitaWSFactory } from '../../domain/models/AggEmpresaReceitaWS/EmpresaReceitaWSFactory';
import { EmpresaReceitaWS } from '../../domain/models/AggEmpresaReceitaWS/EmpresaReceitaWS';
import { EmpresaReceitaWSDTO } from '../dto/DTOEmpresaReceitaWS/EmpresaReceitaWSDTO';
import { configureMappings, mapper } from '../../automapperConfig'; // Importa o mapper configurado
import { injectable } from 'inversify/lib/inversify';

@injectable()
export class EmpresaReceitaWSConsultaService
  implements IEmpresaReceitaWSConsultaService
{
  private apiUrl = 'https://www.receitaws.com.br/v1/cnpj';

  constructor() {
    // Configura os mapeamentos
    configureMappings();
  }

  async consultarCNPJ(cnpj: string): Promise<EmpresaReceitaWSDTO> {
    try {
      // Importa axios dinamicamente
      const axios = await import('axios').then((module) => module.default);

      const response = await axios.get(`${this.apiUrl}/${cnpj}`);
      const empresa = EmpresaReceitaWSFactory.create(response.data);
      let empresaDTO = mapper.map(
        empresa,
        EmpresaReceitaWS,
        EmpresaReceitaWSDTO,
      );
      return empresaDTO;
    } catch (error: any) {
      console.error(
        'Erro ao consultar a API da ReceitaWS:',
        error.response?.data || error.message,
      );

      if (error.response) {
        throw new Error(
          `Erro ao consultar o CNPJ: ${error.response.data?.message || 'Erro desconhecido na resposta da API'}`,
        );
      } else if (error.request) {
        throw new Error('Nenhuma resposta recebida da API da ReceitaWS.');
      } else {
        throw new Error(
          `Erro ao consultar o CNPJ: ${error.message || 'Erro desconhecido'}`,
        );
      }
    }
  }
}
