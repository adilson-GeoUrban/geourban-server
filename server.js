const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔵 CAMINHO ABSOLUTO CORRETO
const publicPath = path.join(__dirname, 'public');

// 🔵 SERVIR ARQUIVOS
app.use(express.static(publicPath));

// 🔵 INDEX
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 🔵 LOGIN
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// 🔴 DEBUG (IMPORTANTE)
app.get('/teste', (req, res) => {
  res.send("SERVIDOR OK");
});

app.listen(PORT, () => {
  console.log("SERVIDOR RODANDO NA PORTA " + PORT);
});
