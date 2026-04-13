const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();

// 🔐 segurança básica
app.disable('x-powered-by');

// 📦 middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🧪 health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 👤 base de usuários (teste)
const USERS = [
  { user: 'admin', pass: '123456', role: 'admin' },
  { user: 'luiza', pass: '123', role: 'user' }
];

// 🔐 login com geração de token
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  const u = USERS.find(u => u.user === user && u.pass === pass);

  if (!u) {
    return res.status(401).json({ message: 'Login inválido' });
  }

  // 🔑 gera token simples
  const token = crypto.randomBytes(16).toString('hex');

  res.json({
    message: 'Login OK',
    user: u.user,
    token: token
  });
});

// 🔒 rota protegida (teste de segurança)
app.get('/secure', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Sem token' });
  }

  res.json({ message: 'Acesso autorizado' });
});

// 🌐 rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 🚀 porta (Render compatível)
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GeoUrban rodando na porta ${PORT}`);
});
