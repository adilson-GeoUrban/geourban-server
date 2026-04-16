const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔓 LOGIN ABERTO (TESTE)
app.post('/login', (req, res) => {
  const { email } = req.body;

  res.json({
    status: 'ok',
    user: {
      nome: 'Admin Teste',
      email: email || 'admin@teste.com'
    }
  });
});

// 🔍 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servidor: 'GeoUrban ONLINE',
    time: new Date()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});
