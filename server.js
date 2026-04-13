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

// 🧠 armazenamento de tokens ativos (memória)
const TOKENS = {};

// 🔐 login com geração de token
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  const u = USERS.find(u => u.user === user && u.pass === pass);

  if (!u) {
    return res.status(401).json({ message: 'Login inválido' });
  }

  // 🔑 gera token
  const token = crypto.randomBytes(32).toString('hex');

  // 💾 salva token com usuário e expiração (2h)
  TOKENS[token] = {
    user: u.user,
    role: u.role,
    exp: Date.now() + (2 * 60 * 60 * 1000)
  };

  res.json({
    message: 'Login OK',
    user: u.user,
    token: token
  });
});

// 🔒 middleware de autenticação real
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Sem token' });
  }

  const token = authHeader.replace('Bearer ', '');

  const session = TOKENS[token];

  if (!session) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  // ⏳ verifica expiração
  if (Date.now() > session.exp) {
    delete TOKENS[token];
    return res.status(403).json({ error: 'Token expirado' });
  }

  req.user = session;
  next();
}

// 🔒 rota protegida real
app.get('/secure', auth, (req, res) => {
  res.json({
    message: 'Acesso autorizado',
    user: req.user
  });
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
