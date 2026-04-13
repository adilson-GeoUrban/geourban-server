const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// 🔐 Segurança básica
app.disable('x-powered-by');

// 📁 Servir frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🧪 Rota de teste (saúde do sistema)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 👤 Usuário fake para teste
const USERS = [
  { user: 'admin', pass: '123456', role: 'admin' },
  { user: 'user', pass: '123', role: 'user' }
];

// 🔑 Chave secreta (variável de ambiente)
const SECRET = process.env.SECRET_KEY || 'geourban_2026_ultra_seguro';

// 🔐 Rota de login
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  const u = USERS.find(u => u.user === user && u.pass === pass);
  if (!u) return res.status(401).json({ message: 'Login inválido' });

  res.json({
    message: 'Login OK',
    user: u.user,
    role: u.role
  });
});

// 🔐 Rota protegida por chave
app.get('/secure', (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== SECRET) return res.status(403).json({ error: 'Acesso negado' });

  res.json({ message: 'Acesso autorizado' });
});

// 🌐 Porta dinâmica Railway / Render
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
http://localhost:8080
http://localhost:8080/health
{
  "user": "admin",
  "pass": "123456"
}
x-api-key: geourban_2026_ultra_seguro
