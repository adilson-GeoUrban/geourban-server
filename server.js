const express = require('express');
const { Sequelize } = require('sequelize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

app.use(express.json());

// 🛡️ SEGURANÇA HTTP
app.use(helmet());

// 🛡️ RATE LIMIT (anti ataque)
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições" }
}));

// 🔥 SERVIR FRONTEND (ESSENCIAL)
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 BLOQUEIO GLOBAL COM TOKEN (AJUSTADO)
app.use((req, res, next) => {
  const token = req.headers['authorization'];

  // libera arquivos estáticos e login
  if (
    req.path.startsWith('/login') ||
    req.path.endsWith('.html') ||
    req.path.endsWith('.js') ||
    req.path.endsWith('.css')
  ) {
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "Token ausente 🔒" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user, timestamp] = decoded.split("|");

    const expirado = (Date.now() - parseInt(timestamp)) > (2 * 60 * 60 * 1000);

    if (!user || expirado) {
      return res.status(403).json({ error: "Token inválido ou expirado 🔒" });
    }

    next();
  } catch {
    return res.status(403).json({ error: "Token inválido 🔒" });
  }
});

// 🗄️ BANCO (PostgreSQL seguro)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// 🔗 CONEXÃO
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado ✅");
  } catch (err) {
    console.error("Erro no banco ❌", err);
  }
})();

// 🚪 LOGIN
app.post('/login', (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "Usuário obrigatório" });
  }

  const token = Buffer.from(user + "|" + Date.now()).toString('base64');

  res.json({ token, user });
});

// 🧪 TESTE
app.get('/protegido', (req, res) => {
  res.json({ status: "Acesso autorizado ✅" });
});

// 🚀 START
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
