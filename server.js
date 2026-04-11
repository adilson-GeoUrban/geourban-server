const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔵 servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 🔵 rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔵 rota login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log("SERVIDOR RODANDO NA PORTA " + PORT);
});
