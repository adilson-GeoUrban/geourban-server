const express = require('express');
const { Sequelize } = require('sequelize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

app.use(express.json());

// 🛡️ SEGURANÇA BÁSICA
app.use(helmet());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));

// 🔥 FRONTEND (LIBERADO)
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 BLOQUEIO DUPLO + MODO INVISÍVEL
app.use((req, res, next) => {

  // ✅ LIBERA FRONTEND
  if (
    req.path === '/' ||
    req.path.startsWith('/login') ||
    req.path.endsWith('.html') ||
    req.path.endsWith('.js') ||
    req.path.endsWith('.css') ||
    req.path.startsWith('/public')
  ) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const token = req.headers['authorization'];

  // 🔒 CAMADA 1 — API KEY
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(404).json({ error: "Not Found" });
  }

  // 🔒 CAMADA 2 — TOKEN
  if (!token) {
    return res.status(404).json({ error: "Not Found" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user, timestamp] = decoded.split("|");

    const expirado = (Date.now() - parseInt(timestamp)) > (2 * 60 * 60 * 1000);

    if (!user || expirado) {
      return res.status(404).json({ error: "Not Found" });
    }

    next();
  } catch {
    return res.status(404).json({ error: "Not Found" });
  }
});

// 🗄️ BANCO
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

// 🚪 LOGIN (gera token)
app.post('/login', (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "Usuário obrigatório" });
  }

  const token = Buffer.from(user + "|" + Date.now()).toString('base64');

  res.json({ token, user });
});

// 🧪 TESTE PROTEGIDO
app.get('/protegido', (req, res) => {
  res.json({ status: "Acesso autorizado ✅" });
});

// 🔁 FALLBACK (sempre responde frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// 🚀 START
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
