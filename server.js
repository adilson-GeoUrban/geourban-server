// ================= 🛡️ GUARDIÕES + AUDITORIA COMPLETA =================

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// 📁 arquivo de log
const logFile = path.join(__dirname, "access.log");

// 📊 controle interno
const tentativas = {};
const LIMITE_TENTATIVAS = 5;
const BLOQUEIO_MS = 15 * 60 * 1000; // 15 minutos

// 🧠 sistema base (evita erro se não existir)
const sistema = {
  ipsBloqueados: []
};

// 🧠 pega IP real (Render / Proxy / Local)
function getIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
}

// 📝 função de log centralizada
function registrarLog(tipo, mensagem) {
  const log = `[${new Date().toISOString()}] ${tipo} | ${mensagem}\n`;
  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Erro ao salvar log");
  });
}

// ================= 🔍 AUDITORIA GLOBAL =================
app.use((req, res, next) => {
  const ip = getIP(req);

  registrarLog(
    "ACESSO",
    `IP: ${ip} | ${req.method} ${req.url} | UA: ${req.headers["user-agent"]}`
  );

  next();
});

// ================= 🚪 GUARDIÃO DA FRENTE (LOGIN) =================
app.post("/login", (req, res) => {
  const ip = getIP(req);
  const agora = Date.now();

  // 🔒 IP bloqueado
  if (tentativas[ip]?.bloqueadoAte > agora) {
    registrarLog("BLOQUEADO", `IP: ${ip} tentou acessar login`);
    return res.status(429).json({
      erro: "Muitas tentativas. Tente novamente mais tarde 🚫"
    });
  }

  const { usuario, senha } = req.body;

  if (
    usuario !== process.env.USUARIO_ADMIN ||
    senha !== process.env.SENHA_ADMIN
  ) {
    if (!tentativas[ip]) tentativas[ip] = { count: 0 };

    tentativas[ip].count++;

    registrarLog("LOGIN_ERRO", `IP: ${ip} tentativa inválida`);

    // 🚫 bloqueio automático
    if (tentativas[ip].count >= LIMITE_TENTATIVAS) {
      tentativas[ip].bloqueadoAte = agora + BLOQUEIO_MS;
      tentativas[ip].count = 0;

      registrarLog("IP_BLOQUEADO", `IP: ${ip} bloqueado por força bruta`);
    }

    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  // ✅ sucesso
  delete tentativas[ip];

  registrarLog("LOGIN_OK", `IP: ${ip} autenticado com sucesso`);

  const token = jwt.sign(
    { usuario, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// ================= 🔐 VERIFICAÇÃO DE TOKEN (CRÍTICO) =================
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    registrarLog("TOKEN_ERRO", "Token não fornecido");
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      registrarLog("TOKEN_INVALIDO", `IP: ${getIP(req)}`);
      return res.status(403).json({ erro: "Token inválido" });
    }

    req.usuario = decoded;
    next();
  });
}

// ================= 🚪 GUARDIÃO DOS FUNDOS =================
function guardiaoFundos(req, res, next) {
  const ip = getIP(req);

  if (
    sistema.ipsBloqueados.includes(ip) ||
    (tentativas[ip] && tentativas[ip].bloqueadoAte > Date.now())
  ) {
    registrarLog("ACESSO_NEGADO", `IP: ${ip}`);
    return res.status(403).json({ erro: "Acesso bloqueado 🚫" });
  }

  next();
}

// ================= 🔒 PROTEÇÃO DE ROTAS =================
app.use("/admin", verificarToken, guardiaoFundos);
app.use("/ia", verificarToken, guardiaoFundos);
app.use("/api", verificarToken, guardiaoFundos);
