import { EmpresaReceitaWSDTO } from '../dto/DTOEmpresaReceitaWS/EmpresaReceitaWSDTO';

export interface IEmpresaReceitaWSConsultaService {
  consultarCNPJ(cnpj: string): Promise<EmpresaReceitaWSDTO>;
}
