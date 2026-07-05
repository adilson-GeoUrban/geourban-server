const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir pasta public
app.use(express.static(path.join(__dirname, 'public')));

// healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GeoUrban',
    server: 'Railway'
  });
});


// 🔐 LOGIN API (JWT)
app.post('/api/login', (req, res) => {

  const { email, senha } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@geourban.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha obrigatórios'
    });
  }

  if (email === adminEmail && senha === adminPassword) {

    const token = jwt.sign(
      {
        email: adminEmail,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'geourban_secret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login autorizado',
      token
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Email ou senha inválidos'
  });
});


// página login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// IA
app.get('/ia', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ia.html'));
});


// fallback
app.use((req, res) => {
  res.redirect('/');
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 GeoUrban online na porta ${PORT}`);
});
