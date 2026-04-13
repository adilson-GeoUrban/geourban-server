const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// 🔐 segurança básica
app.disable('x-powered-by');

// 📁 frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🧪 health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 👤 base de usuários (teste)
const USERS = [
  { user: 'admin', pass: '123456', role: 'admin' }
];

// 🔑 chave secreta
const SECRET = process.env.SECRET_KEY || 'geourban_ultra_seguro';

// 🔐 login
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  const u = USERS.find(u => u.user === user && u.pass === pass);
  if (!u) return res.status(401).json({ message: 'Login inválido' });

  res.json({ message: 'Login OK', user: u.user });
});

// 🔒 rota protegida
app.get('/secure', (req, res) => {
  const key = req.headers['x-api-key'];

  if (key !== SECRET) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  res.json({ message: 'Acesso autorizado' });
});

// 🌐 porta
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
