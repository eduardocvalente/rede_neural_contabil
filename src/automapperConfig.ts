import { createMapper, createMap } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CNAE } from './domain/models/AggCNAE/CNAE';
import { CNAEDTO } from './services/dto/DTOCNAE/CNAEDTO';
import { SimplesReceitaWS } from './domain/models/AggEmpresaReceitaWS/SimplesReceitaWS';
import { SocioReceitaWS } from './domain/models/AggEmpresaReceitaWS/SocioReceitaWS';
import { SocioReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/SocioReceitaWSDTO';
import { SimplesReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/SimplesReceitaWSDTO';
import { SimeiReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/SimeiReceitaWSDTO';
import { SimeiReceitaWS } from './domain/models/AggEmpresaReceitaWS/SimeiReceitaWS';
import { EmpresaSocioReceitaWS } from './domain/models/AggEmpresaReceitaWS/EmpresaSocioReceitaWS';
import { EmpresaReceitaWS } from './domain/models/AggEmpresaReceitaWS/EmpresaReceitaWS';
import { EmpresaCNAESecundarioReceitaWS } from './domain/models/AggEmpresaReceitaWS/EmpresaCNAESecundarioReceitaWS';
import { EmpresaCNAESecundarioReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/EmpresaCNAESecundarioReceitaWSDTO';
import { EmpresaReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/EmpresaReceitaWSDTO';
import { EmpresaSocioReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/EmpresaSocioReceitaWSDTO';
import { AtividadeReceitaWSDTO } from './services/dto/DTOEmpresaReceitaWS/AtividadeReceitaWSDTO';
import { AtividadeReceitaWS } from './domain/models/AggEmpresaReceitaWS/AtividadeReceitaWS';
import { TrainingOutput } from './domain/models/AggTrainingData/TrainingOutput';
import { TrainingInput } from './domain/models/AggTrainingData/TrainingInput';
import { TrainingData } from './domain/models/AggTrainingData/TrainingData';
import { TrainingDataDTO } from './services/dto/DTOTrainingData/TrainingDataDTO';
import { TrainingInputDTO } from './services/dto/DTOTrainingData/TrainingInputDTO';
import { TrainingOutputDTO } from './services/dto/DTOTrainingData/TrainingOutputDTO';
import { PlanoDeContasDTO } from './services/dto/DTOPlanoDeContas/PlanoDeContasDTO';
import { PlanoDeContas } from './domain/models/AggPlanoDeContas/PlanoDeContas';
import { NCMDTO } from './services/dto/DTONCM/NCMDTO';
import { NCM } from './domain/models/AggNCM/NCM';
import { X509Data } from './domain/models/AggNfeProc/X509Data';
import { Transp } from './domain/models/AggNfeProc/Transp';
import { TranspDTO } from './services/dto/DTONfeProc/TranspDTO';
import { X509DataDTO } from './services/dto/DTONfeProc/X509DataDTO';
import { TransformDTO } from './services/dto/DTONfeProc/TransformDTO';
import { Prod } from './domain/models/AggNfeProc/Prod';
import { Transform } from './domain/models/AggNfeProc/Transform';
import { Total } from './domain/models/AggNfeProc/Total';
import { TotalDTO } from './services/dto/DTONfeProc/TotalDTO';
import { SignedInfo } from './domain/models/AggNfeProc/SignedInfo';
import { SignedInfoDTO } from './services/dto/DTONfeProc/SignedInfoDTO';
import { SignatureMethod } from './domain/models/AggNfeProc/SignatureMethod';
import { Signature } from './domain/models/AggNfeProc/Signature';
import { Reference } from './domain/models/AggNfeProc/Reference';
import { ReferenceDTO } from './services/dto/DTONfeProc/ReferenceDTO';
import { SignatureDTO } from './services/dto/DTONfeProc/SignatureDTO';
import { SignatureMethodDTO } from './services/dto/DTONfeProc/SignatureMethodDTO';
import { ProtNFeDTO } from './services/dto/DTONfeProc/ProtNFeDTO';
import { ProtNFe } from './domain/models/AggNfeProc/ProtNFe';
import { ProdDTO } from './services/dto/DTONfeProc/ProdDTO';
import { PISType } from './domain/models/AggNfeProc/PISType';
import { PISTypeDTO } from './services/dto/DTONfeProc/PISTypeDTO';
import { PISDTO } from './services/dto/DTONfeProc/PISDTO';
import { PIS } from './domain/models/AggNfeProc/PIS';
import { Pag } from './domain/models/AggNfeProc/Pag';
import { PagDTO } from './services/dto/DTONfeProc/PagDTO';
import { NfeProc } from './domain/models/AggNfeProc/NfeProc';
import { NFeDTO } from './services/dto/DTONfeProc/NFeDTO';
import { NFe } from './domain/models/AggNfeProc/NFe';
import { KeyInfo } from './domain/models/AggNfeProc/KeyInfo';
import { KeyInfoDTO } from './services/dto/DTONfeProc/KeyInfoDTO';
import { InfRespTecDTO } from './services/dto/DTONfeProc/InfRespTecDTO';
import { InfRespTec } from './domain/models/AggNfeProc/InfRespTec';
import { InfProt } from './domain/models/AggNfeProc/InfProt';
import { InfProtDTO } from './services/dto/DTONfeProc/InfProtDTO';
import { InfNFeSupl } from './domain/models/AggNfeProc/InfNFeSupl';
import { InfNFe } from './domain/models/AggNfeProc/InfNFe';
import { InfNFeDTO } from './services/dto/DTONfeProc/InfNFeDTO';
import { InfNFeSuplDTO } from './services/dto/DTONfeProc/InfNFeSuplDTO';
import { InfAdicDTO } from './services/dto/DTONfeProc/InfAdicDTO';
import { ImpostoDTO } from './services/dto/DTONfeProc/ImpostoDTO';
import { Imposto } from './domain/models/AggNfeProc/Imposto';
import { InfAdic } from './domain/models/AggNfeProc/InfAdic';
import { Ide } from './domain/models/AggNfeProc/Ide';
import { ICMSType } from './domain/models/AggNfeProc/ICMSType';
import { IdeDTO } from './services/dto/DTONfeProc/IdeDTO';
import { ICMSTypeDTO } from './services/dto/DTONfeProc/ICMSTypeDTO';
import { ICMSTotDTO } from './services/dto/DTONfeProc/ICMSTotDTO';
import { ICMSTot } from './domain/models/AggNfeProc/ICMSTot';
import { ICMS } from './domain/models/AggNfeProc/ICMS';
import { ICMSDTO } from './services/dto/DTONfeProc/ICMSDTO';
import { EnderEmit } from './domain/models/AggNfeProc/EnderEmit';
import { EnderEmitDTO } from './services/dto/DTONfeProc/EnderEmitDTO';
import { EnderDestDTO } from './services/dto/DTONfeProc/EnderDestDTO';
import { EnderDest } from './domain/models/AggNfeProc/EnderDest';
import { Emit } from './domain/models/AggNfeProc/Emit';
import { EmitDTO } from './services/dto/DTONfeProc/EmitDTO';
import { DigestMethod } from './domain/models/AggNfeProc/DigestMethod';
import { DigestMethodDTO } from './services/dto/DTONfeProc/DigestMethodDTO';
import { DetPagDTO } from './services/dto/DTONfeProc/DetPagDTO';
import { DetPag } from './domain/models/AggNfeProc/DetPag';
import { DetDTO } from './services/dto/DTONfeProc/DetDTO';
import { Det } from './domain/models/AggNfeProc/Det';
import { Dest } from './domain/models/AggNfeProc/Dest';
import { DestDTO } from './services/dto/DTONfeProc/DestDTO';
import { COFINSType } from './domain/models/AggNfeProc/COFINSType';
import { COFINSTypeDTO } from './services/dto/DTONfeProc/COFINSTypeDTO';
import { COFINSDTO } from './services/dto/DTONfeProc/COFINSDTO';
import { COFINS } from './domain/models/AggNfeProc/COFINS';
import { Card } from './domain/models/AggNfeProc/Card';
import { CardDTO } from './services/dto/DTONfeProc/CardDTO';
import { CanonicalizationMethod } from './domain/models/AggNfeProc/CanonicalizationMethod';
import { AutXMLDTO } from './services/dto/DTONfeProc/AutXMLDTO';
import { AutXML } from './domain/models/AggNfeProc/AutXML';
import { CanonicalizationMethodDTO } from './services/dto/DTONfeProc/CanonicalizationMethodDTO';
import { NfeProcDTO } from './services/dto/DTONfeProc/NfeProcDTO';

export const mapper = createMapper({
  strategyInitializer: classes(),
});

export function configureMappings() {
  // DTOCNAE
  safeCreateMap(mapper, CNAE, CNAEDTO);

  // DTONfeProc
  safeCreateMap(mapper, AutXML, AutXMLDTO);
  safeCreateMap(mapper, CanonicalizationMethod, CanonicalizationMethodDTO);
  safeCreateMap(mapper, Card, CardDTO);
  safeCreateMap(mapper, COFINS, COFINSDTO);
  safeCreateMap(mapper, COFINSType, COFINSTypeDTO);
  safeCreateMap(mapper, Dest, DestDTO);
  safeCreateMap(mapper, Det, DetDTO);
  safeCreateMap(mapper, DetPag, DetPagDTO);
  safeCreateMap(mapper, DigestMethod, DigestMethodDTO);
  safeCreateMap(mapper, Emit, EmitDTO);
  safeCreateMap(mapper, EnderDest, EnderDestDTO);
  safeCreateMap(mapper, EnderEmit, EnderEmitDTO);
  safeCreateMap(mapper, ICMS, ICMSDTO);
  safeCreateMap(mapper, ICMSTot, ICMSTotDTO);
  safeCreateMap(mapper, ICMSType, ICMSTypeDTO);
  safeCreateMap(mapper, Ide, IdeDTO);
  safeCreateMap(mapper, Imposto, ImpostoDTO);
  safeCreateMap(mapper, InfAdic, InfAdicDTO);
  safeCreateMap(mapper, InfNFe, InfNFeDTO);
  safeCreateMap(mapper, InfNFeSupl, InfNFeSuplDTO);
  safeCreateMap(mapper, InfProt, InfProtDTO);
  safeCreateMap(mapper, InfRespTec, InfRespTecDTO);
  safeCreateMap(mapper, KeyInfo, KeyInfoDTO);
  safeCreateMap(mapper, NFe, NFeDTO);
  safeCreateMap(mapper, NfeProc, NfeProcDTO);
  safeCreateMap(mapper, Pag, PagDTO);
  safeCreateMap(mapper, PIS, PISDTO);
  safeCreateMap(mapper, PISType, PISTypeDTO);
  safeCreateMap(mapper, Prod, ProdDTO);
  safeCreateMap(mapper, ProtNFe, ProtNFeDTO);
  safeCreateMap(mapper, Reference, ReferenceDTO);
  safeCreateMap(mapper, Signature, SignatureDTO);
  safeCreateMap(mapper, SignatureMethod, SignatureMethodDTO);
  safeCreateMap(mapper, SignedInfo, SignedInfoDTO);
  safeCreateMap(mapper, Total, TotalDTO);
  safeCreateMap(mapper, Transform, TransformDTO);
  safeCreateMap(mapper, Transp, TranspDTO);
  safeCreateMap(mapper, X509Data, X509DataDTO);

  // DTONCM
  safeCreateMap(mapper, NCM, NCMDTO);

  // DTOPlanoDeContas
  safeCreateMap(mapper, PlanoDeContas, PlanoDeContasDTO);

  // DTOTrainingData
  safeCreateMap(mapper, TrainingData, TrainingDataDTO);
  safeCreateMap(mapper, TrainingInput, TrainingInputDTO);
  safeCreateMap(mapper, TrainingOutput, TrainingOutputDTO);

  // DTOEmpresaReceitaWS
  safeCreateMap(mapper, AtividadeReceitaWS, AtividadeReceitaWSDTO);
  safeCreateMap(
    mapper,
    EmpresaCNAESecundarioReceitaWS,
    EmpresaCNAESecundarioReceitaWSDTO,
  );
  safeCreateMap(mapper, EmpresaReceitaWS, EmpresaReceitaWSDTO);
  safeCreateMap(mapper, EmpresaSocioReceitaWS, EmpresaSocioReceitaWSDTO);
  safeCreateMap(mapper, SimeiReceitaWS, SimeiReceitaWSDTO);
  safeCreateMap(mapper, SimplesReceitaWS, SimplesReceitaWSDTO);
  safeCreateMap(mapper, SocioReceitaWS, SocioReceitaWSDTO);
}

function safeCreateMap(mapper: any, source: any, destination: any) {
  try {
    createMap(mapper, source, destination);
    //console.log(`Mapeamento bem-sucedido: ${source.name} -> ${destination.name}`);
  } catch (error) {
    console.error(
      `Erro ao mapear ${source.name} para ${destination.name}:`,
      error,
    );
  }
}
