const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ia
app.get('/ia', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ia.html'));
});

// fallback
app.use((req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GeoUrban online ${PORT}`);
});
