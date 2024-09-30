import express from 'express';
import routes from './ui/routes';
import path from 'path';

const app = express();

// Configuração do EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ui', 'views'));

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'ui', 'public')));

//Middleware para processar corpos de requisições em JSON.
app.use(express.json());

// Middleware para processar dados enviados por formulários HTML, codificados em URL
app.use(express.urlencoded({ extended: true }));

// carrega as rotas configuradas no arquivo routes.ts
app.use(routes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
