const express = require('express');
const path = require('path');
const LuizaBridge = require('./src/bridge/luiza-bridge');
const ControlPlane = require('./src/control-plane/control-plane');

const app = express();

// ==============================
// MIDDLEWARES
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ==============================
// HEALTH CHECK
// ==============================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GeoUrban',
    server: 'Railway',
    bridge: LuizaBridge.getStatus()
  });
});

// ==============================
// LOGIN API
// ==============================
app.post('/api/login', (req, res) => {

  // Aceita tanto "senha" quanto "password"
  const { email, senha, password } = req.body;

  const senhaRecebida = senha || password;

  // Credenciais
  const adminEmail =
    process.env.ADMIN_EMAIL || 'admin@geourban.com.br';

  const adminPassword =
    process.env.ADMIN_PASSWORD || '123456';

  // Logs para diagnóstico
  console.log('===================================');
  console.log('NOVA TENTATIVA DE LOGIN');
  console.log('Email recebido:', email);
  console.log('Senha enviada:', senhaRecebida ? 'SIM' : 'NÃO');
  console.log('Email esperado:', adminEmail);
  console.log('ADMIN_PASSWORD configurada:', adminPassword ? 'SIM' : 'NÃO');
  console.log('Email igual?', email === adminEmail);
  console.log('Senha igual?', senhaRecebida === adminPassword);
  console.log('===================================');

  // Validação
  if (!email || !senhaRecebida) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha obrigatórios'
    });
  }

  // Login autorizado
  if (
    email === adminEmail &&
    senhaRecebida === adminPassword
  ) {

    console.log('LOGIN AUTORIZADO');

    return res.status(200).json({
      success: true,
      message: 'Login autorizado',
      redirect: '/dashboard'
    });

  }

  console.log('LOGIN NEGADO');

  return res.status(401).json({
    success: false,
    message: 'Email ou senha inválidos'
  });

});

// ==============================
// LUIZA BRIDGE ENDPOINTS
// ==============================

// Endpoint controlado para chamar Luiza
app.post('/api/luiza', async (req, res) => {
  try {
    const { input, context, userId } = req.body;

    if (!input) {
      return res.status(400).json({
        ok: false,
        message: 'Input obrigatório para chamar Luiza'
      });
    }

    const result = await LuizaBridge.process({
      input,
      context: context || 'geourban',
      userId: userId || 'anonymous'
    });

    return res.status(result.ok ? 200 : 400).json(result);
  } catch (error) {
    console.error('Erro no endpoint /api/luiza:', error);
    return res.status(500).json({
      ok: false,
      message: 'Erro ao processar requisição',
      error: error.message
    });
  }
});

// Status da Bridge
app.get('/api/bridge/status', (req, res) => {
  res.status(200).json({
    ok: true,
    bridge: LuizaBridge.getStatus(),
    controlPlane: ControlPlane.getStats()
  });
});

// Auditoria da Bridge
app.get('/api/bridge/audit', (req, res) => {
  const audit = LuizaBridge.getAuditLog();
  res.status(200).json({
    ok: true,
    auditCount: audit.length,
    audit: audit.slice(-50) // Últimos 50
  });
});

// ==============================
// ROTAS
// ==============================

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

// ==============================
// FALLBACK
// ==============================
app.use((req, res) => {
  res.redirect('/');
});

// ==============================
// SERVIDOR
// ==============================
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {

  console.log('===================================');
  console.log('🌍 GeoUrban iniciado com sucesso');
  console.log(`🚀 Porta: ${PORT}`);
  console.log(`📧 ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'admin@geourban.com.br'}`);
  console.log(`🔐 ADMIN_PASSWORD configurada: ${process.env.ADMIN_PASSWORD ? 'SIM' : 'USANDO PADRÃO (123456)'}`);
  console.log('🔌 Luiza Bridge: INTEGRADA');
  console.log(`   Host: ${process.env.LUIZA_HOST || 'luiza-lab-production-8cf5.up.railway.app'}`);
  console.log('===================================');

});

