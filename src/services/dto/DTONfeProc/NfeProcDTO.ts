// src/services/dto/DTONfeProc/NfeProcDTO.ts

import { AutoMap } from '@automapper/classes';
import { NFeDTO } from './NFeDTO';
import { ProtNFeDTO } from './ProtNFeDTO';
import { EmpresaReceitaWSDTO } from '../DTOEmpresaReceitaWS/EmpresaReceitaWSDTO';

/* Conferido dia 03/09/2024 às 15:42 */
export class NfeProcDTO {
  @AutoMap()
  xmlns: string;

  @AutoMap()
  versao: string;

  @AutoMap(() => [NFeDTO])
  NFe: NFeDTO[];

  @AutoMap(() => [ProtNFeDTO])
  protNFe: ProtNFeDTO[];

  public emitenteEmpresaReceitaWSDTO?: EmpresaReceitaWSDTO;
  public destinatarioEmpresaReceitaWSDTO?: EmpresaReceitaWSDTO;

  // Array de classificações Data
  public classificacoes?:
    | {
        contaDebito: string;
        contaCredito: string;
        confidences: {
          contaDebito: number; // Alterado de string para number
          contaCredito: number; // Alterado de string para number
        };
      }[]
    | null = null;

  constructor(
    xmlns: string,
    versao: string,
    NFe: NFeDTO[],
    protNFe: ProtNFeDTO[],
  ) {
    this.xmlns = xmlns;
    this.versao = versao;
    this.NFe = NFe;
    this.protNFe = protNFe;
  }

  // Método para adicionar uma nova classificação ao array
  public addClassificationData(
    contaDebito: string,
    contaCredito: string,
    confidences: { contaDebito: number; contaCredito: number }, // Alterado para number
  ): void {
    if (!this.classificacoes) {
      // Inicializa classificacoes se estiver nulo
      this.classificacoes = [];
    }
    this.classificacoes.push({ contaDebito, contaCredito, confidences });
  }

  // Método para remover uma classificação com base na contaDebito e contaCredito
  public removeClassificationData(
    contaDebito: string,
    contaCredito: string,
  ): void {
    if (!this.classificacoes) return; // Verifica se classificacoes é nulo
    this.classificacoes = this.classificacoes.filter(
      (classificacao) =>
        classificacao.contaDebito !== contaDebito ||
        classificacao.contaCredito !== contaCredito,
    );
  }

  // Método para remover uma classificação com base no índice
  public removeClassificationByIndex(index: number): void {
    if (
      !this.classificacoes ||
      index < 0 ||
      index >= this.classificacoes.length
    ) {
      console.error('Índice fora dos limites ou classificações não definidas');
      return;
    }
    this.classificacoes.splice(index, 1); // Remove a classificação pelo índice
  }
}
