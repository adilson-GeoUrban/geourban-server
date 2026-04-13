const express = require('express');
const { Sequelize } = require('sequelize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// 🛡️ SEGURANÇA GLOBAL
app.use(helmet());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições" }
}));

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

// 🔗 CONEXÃO SEGURA
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado ✅");
  } catch (err) {
    console.error("Erro no banco ❌", err);
  }
})();
Refactor server.js for security and database connection
Security update: implement HTTP protection, rate limiting, and secure PostgreSQL connection
Security hardening: add helmet, rate limit, and secure DB connection (LGPD compliance step)
