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
