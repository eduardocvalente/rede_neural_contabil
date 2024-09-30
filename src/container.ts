// src/container.ts

import { Container } from 'inversify';
import 'reflect-metadata';
import { IPlanoDeContasRepository } from './domain/models/AggPlanoDeContas/IPlanoDeContasRepository';
import { FileSystemPlanoDeContasRepository } from './domain/models/AggPlanoDeContas/FileSystemPlanoDeContasRepository';
import { IPlanoDeContasService } from './services/interfaces/IPlanoDeContasService';
import { PlanoDeContasService } from './services/implementations/PlanoDeContasService';
import { IPlanoDeContasController } from './ui/controllers/interfaces/IPlanoDeContasController';
import { PlanoDeContasController } from './ui/controllers/implementations/PlanoDeContasController';
import { PlanoDeContasRoutes } from './ui/routes/planoDeContasRoutes';
import { ITrainingDataRepository } from './domain/models/AggTrainingData/ITrainingDataRepository';
import { ITrainingDataService } from './services/interfaces/ITrainingDataService';
import { ITrainingDataController } from './ui/controllers/interfaces/ITrainingDataController';
import { TrainingDataService } from './services/implementations/TrainingDataService';
import { FileSystemTrainingDataRepository } from './domain/models/AggTrainingData/FileSystemTrainingDataRepository';
import { TrainingDataController } from './ui/controllers/implementations/TrainingDataController';
import { TrainingDataRoutes } from './ui/routes/TrainingDataRoutes';
import { ICNAERepository } from './domain/models/AggCNAE/ICNAERepository';
import { ICNAEService } from './services/interfaces/ICNAEService';
import { ICNAEController } from './ui/controllers/interfaces/ICNAEController';
import { CNAEService } from './services/implementations/CNAEService';
import { FileSystemCNAERepository } from './domain/models/AggCNAE/FileSystemCNAERepository';
import { CNAEController } from './ui/controllers/implementations/CNAEController';
import { CNAERoutes } from './ui/routes/CNAERoutes';
import { INCMRepository } from './domain/models/AggNCM/INCMRepository';
import { INCMService } from './services/interfaces/INCMService';
import { INCMController } from './ui/controllers/interfaces/INCMController';
import { NCMRoutes } from './ui/routes/NCMRoutes';
import { NCMService } from './services/implementations/NCMService';
import { FileSystemNCMRepository } from './domain/models/AggNCM/FileSystemNCMRepository';
import { NCMController } from './ui/controllers/implementations/NCMController';
import { IFileUploadService } from './services/interfaces/IFileUploadService';
import { IFileUploadController } from './ui/controllers/interfaces/IFileUploadController';
import { FileUploadService } from './services/implementations/FileUploadService';
import { FileUploadController } from './ui/controllers/implementations/FileUploadController';
import { FileUploadRoutes } from './ui/routes/FileUploadRoutes';
import { INfeService } from './services/interfaces/INfeService';
import { NfeService } from './services/implementations/NfeService';
import { IEmpresaReceitaWSConsultaService } from './services/interfaces/IEmpresaReceitaWSConsultaService';
import { EmpresaReceitaWSConsultaService } from './services/implementations/EmpresaReceitaWSConsultaService';

const container = new Container();

// Ligações de Plano de Contas
container
  .bind<IPlanoDeContasRepository>('IPlanoDeContasRepository')
  .to(FileSystemPlanoDeContasRepository);
container
  .bind<IPlanoDeContasService>('IPlanoDeContasService')
  .to(PlanoDeContasService);
container
  .bind<IPlanoDeContasController>('IPlanoDeContasController')
  .to(PlanoDeContasController);
container.bind<PlanoDeContasRoutes>(PlanoDeContasRoutes).toSelf();

// Ligações de TrainingData
container
  .bind<ITrainingDataRepository>('ITrainingDataRepository')
  .to(FileSystemTrainingDataRepository)
  .inSingletonScope(); //singleton
container
  .bind<ITrainingDataService>('ITrainingDataService')
  .to(TrainingDataService)
  .inSingletonScope(); //singleton
container
  .bind<ITrainingDataController>('ITrainingDataController')
  .to(TrainingDataController);
container.bind<TrainingDataRoutes>(TrainingDataRoutes).toSelf();

// Ligações de CNAE
container.bind<ICNAERepository>('ICNAERepository').to(FileSystemCNAERepository);
container.bind<ICNAEService>('ICNAEService').to(CNAEService);
container.bind<ICNAEController>('ICNAEController').to(CNAEController);
container.bind<CNAERoutes>(CNAERoutes).toSelf();

// Ligações de NCM
container.bind<INCMRepository>('INCMRepository').to(FileSystemNCMRepository);
container.bind<INCMService>('INCMService').to(NCMService);
container.bind<INCMController>('INCMController').to(NCMController);
container.bind<NCMRoutes>(NCMRoutes).toSelf();

// Ligações de Upload de Arquivos
container.bind<IFileUploadService>('IFileUploadService').to(FileUploadService);
container
  .bind<IFileUploadController>('IFileUploadController')
  .to(FileUploadController);
container.bind<FileUploadRoutes>(FileUploadRoutes).toSelf();

// Ligações de NFe
container.bind<INfeService>('INfeService').to(NfeService);

// Ligações de Empresa Receita WS Consulta
container
  .bind<IEmpresaReceitaWSConsultaService>('IEmpresaReceitaWSConsultaService')
  .to(EmpresaReceitaWSConsultaService);

export { container };
