import { EmpresaReceitaWS } from "./EmpresaReceitaWS";
import { AtividadeReceitaWS } from "./AtividadeReceitaWS";
import { SocioReceitaWS } from "./SocioReceitaWS";
import { SimplesReceitaWS } from "./SimplesReceitaWS";
import { SimeiReceitaWS } from "./SimeiReceitaWS";

export class EmpresaReceitaWSFactory {
    static create(json: any): EmpresaReceitaWS {
        const atividadesPrincipais = (json.atividade_principal || []).map((atividade: any) => {
            return new AtividadeReceitaWS(atividade?.code || '', atividade?.text || '');
        });

        const atividadesSecundarias = (json.atividades_secundarias || []).map((atividade: any) => {
            return new AtividadeReceitaWS(atividade?.code || '', atividade?.text || '');
        });

        const socios = (json.qsa || []).map((socio: any) => {
            return new SocioReceitaWS(
                socio?.nome || '',
                socio?.qual || '',
                socio?.nome_rep_legal || '',
                socio?.qual_rep_legal || ''
            );
        });

        const simples = new SimplesReceitaWS(
            json?.simples?.optante || false,
            json?.simples?.data_opcao || '',
            json?.simples?.data_exclusao || '',
            json?.simples?.ultima_atualizacao || ''
        );

        const simei = new SimeiReceitaWS(
            json?.simei?.optante || false,
            json?.simei?.data_opcao || null,
            json?.simei?.data_exclusao || null,
            json?.simei?.ultima_atualizacao || ''
        );

        return new EmpresaReceitaWS(
            json?.abertura || '',
            json?.situacao || '',
            json?.tipo || '',
            json?.nome || '',
            json?.fantasia || '',
            json?.porte || '',
            json?.natureza_juridica || '',
            atividadesPrincipais,
            atividadesSecundarias,
            socios,
            json?.logradouro || '',
            json?.numero || '',
            json?.complemento || '',
            json?.bairro || '',
            json?.municipio || '',
            json?.uf || '',
            json?.cep || '',
            json?.email || '',
            json?.telefone || '',
            json?.cnpj || '',
            json?.capital_social || '0.00',
            simples,
            simei
        );
    }
}
