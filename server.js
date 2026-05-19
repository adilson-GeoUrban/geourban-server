const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir arquivos estáticos da raiz
app.use(express.static(__dirname));

// healthcheck Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// IA
app.get('/ia', (req, res) => {
  res.sendFile(path.join(__dirname, 'ia.html'));
});

// fallback
app.use((req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 GeoUrban online na porta ${PORT}`);
});
