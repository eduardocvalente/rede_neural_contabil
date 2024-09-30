import express, { Router } from 'express';
import { container } from '../container';
import { PlanoDeContasRoutes } from '../ui/routes/planoDeContasRoutes';
import { CNAERoutes } from '../ui/routes/CNAERoutes';
import { NCMRoutes } from './routes/NCMRoutes';
import { TrainingDataRoutes } from './routes/TrainingDataRoutes';
import { FileUploadRoutes } from './routes/FileUploadRoutes';

const router = Router();

// Configuração das rotas de API
const planoDeContasRoutes =
  container.get<PlanoDeContasRoutes>(PlanoDeContasRoutes);
router.use('/api', planoDeContasRoutes.getRouter());

const cnaeRoutes = container.get<CNAERoutes>(CNAERoutes);
router.use('/api', cnaeRoutes.getRouter());

const ncmRoutes = container.get<NCMRoutes>(NCMRoutes);
router.use('/api', ncmRoutes.getRouter());

const trainingDataRoutes =
  container.get<TrainingDataRoutes>(TrainingDataRoutes);
router.use('/api', trainingDataRoutes.getRouter());

const fileUploadRoutes = container.get<FileUploadRoutes>(FileUploadRoutes);
router.use('/api', fileUploadRoutes.getRouter());

// Rotas para renderizar as views EJS
// Rota principal
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Página Principal',
    message: 'Bem-vindo ao sistema de gestão!',
  });
});

// Rota para renderizar a página de visualização do Plano de Contas
router.get('/planoContas', (req, res) => {
  res.render('planoContas', {
    title: 'Plano de Contas',
    message: 'Aqui está o plano de contas.',
  });
});

// Rota para Upload de Notas Fiscais
router.get('/uploadNotasFiscais', (req, res) => {
  res.render('uploadNotasFiscais', {
    title: 'Upload de Notas Fiscais',
    message: 'Faça o upload das suas notas fiscais.',
  });
});

export default router;
