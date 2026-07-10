const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GeoUrban',
    server: 'Railway'
  });
});

// ==============================
// LOGIN API
// ==============================
app.post('/api/login', (req, res) => {

  // Aceita "senha" ou "password"
  const { email, senha, password } = req.body;

  const senhaRecebida = senha || password;

  const adminEmail =
    process.env.ADMIN_EMAIL || 'admin@geourban.com.br';

  const adminPassword =
    process.env.ADMIN_PASSWORD || '123456';

  // Logs temporários (remover em produção)
  console.log('==========================');
  console.log('LOGIN RECEBIDO');
  console.log('Email:', email);
  console.log('Senha enviada:', senhaRecebida ? 'SIM' : 'NÃO');
  console.log('Email esperado:', adminEmail);
  console.log('Senha configurada:', adminPassword ? 'SIM' : 'NÃO');
  console.log('==========================');

  if (!email || !senhaRecebida) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha obrigatórios'
    });
  }

  if (
    email === adminEmail &&
    senhaRecebida === adminPassword
  ) {
    return res.status(200).json({
      success: true,
      message: 'Login autorizado',
      redirect: '/dashboard'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Email ou senha inválidos'
  });
});

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// IA
app.get('/ia', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ia.html'));
});

// Fallback
app.use((req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 GeoUrban online na porta ${PORT}`);
  console.log(`📧 ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'admin@geourban.com.br'}`);
  console.log(`🔐 ADMIN_PASSWORD configurada: ${process.env.ADMIN_PASSWORD ? 'SIM' : 'USANDO PADRÃO (123456)'}`);
});
