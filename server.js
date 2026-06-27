const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// ROTAS DA API (devem vir ANTES do fallback)
// ============================================

// Healthcheck Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GeoUrban',
    server: 'Railway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API de Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validação básica
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }
  
  // Resposta de teste (implementar autenticação real conforme necessário)
  res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso',
    token: 'test-token-' + Date.now(),
    user: {
      email: email,
      name: email.split('@')[0]
    }
  });
});

// ============================================
// ROTAS DE PÁGINAS (devem vir ANTES do fallback)
// ============================================

// Rota principal - Login
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

// ============================================
// ERROR HANDLER (deve vir ANTES do fallback)
// ============================================

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// FALLBACK (deve ser o ÚLTIMO middleware)
// ============================================

// Fallback - redireciona rotas desconhecidas para home
app.use((req, res) => {
  res.redirect('/');
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 GeoUrban online na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
