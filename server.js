npm install pg pg-hstore
DATABASE_URL=postgres://USER:SENHA@HOST:PORT/DB
SECRET_KEY=geourban_super_seguro
PORT=8080
const { Sequelize } = require('sequelize');

// 🗄️ conexão PostgreSQL
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

// 🔄 sincronização (USA SÓ UMA)
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco conectado e sincronizado ✅");
  })
  .catch(err => {
    console.error("Erro no banco ❌", err);
  });
Banco conectado e sincronizado ✅
// 🛡️ ROBÔ 1 — headers de segurança (porta da frente)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// 🛡️ ROBÔ 2 — rate limit simples (anti ataque força bruta)
const LIMIT = {};
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!LIMIT[ip]) LIMIT[ip] = { count: 1, time: now };

  if (now - LIMIT[ip].time < 60000) {
    LIMIT[ip].count++;
    if (LIMIT[ip].count > 100) {
      return res.status(429).json({ error: 'Muitas requisições' });
    }
  } else {
    LIMIT[ip] = { count: 1, time: now };
  }

  next();
});
