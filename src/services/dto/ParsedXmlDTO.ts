// src/services/dto/ParsedXmlDTO.ts

export interface ParsedXmlDTO {
  // Defina as propriedades conforme a estrutura do seu XML
  NFeProc: {
    xmlns: string;
    versao: string;
    NFe: Array<{
      // ... estrutura dos dados ...
    }>;
    protNFe: Array<{
      // ... estrutura dos dados ...
    }>;
  };
}
