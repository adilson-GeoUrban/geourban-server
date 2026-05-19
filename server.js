const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da raiz
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// HEALTHCHECK RAILWAY
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GeoUrban',
    server: 'Railway'
  });
});

// ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// DASHBOARD
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// IA
app.get('/ia', (req, res) => {
  res.sendFile(path.join(__dirname, 'ia.html'));
});

// FALLBACK - redireciona rotas desconhecidas para home
app.use((req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🌍 GeoUrban rodando na porta', PORT);
});
