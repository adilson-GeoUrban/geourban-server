const express = require('express');
const path = require('path');

const app = express();

// 🔐 Segurança básica
app.disable('x-powered-by');

// 📁 Servir frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🧪 Rota de teste (saúde do sistema)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🌐 Rota raiz (evita erro "Cannot GET /")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🚀 Porta dinâmica Railway (OBRIGATÓRIO)
const PORT = process.env.PORT || 8080;

// 🔥 Start servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
