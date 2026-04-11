// ================= 🛡️ GUARDIÕES (FRENTE + FUNDOS) =================

// 📊 controle interno
const tentativas = {};
const LIMITE_TENTATIVAS = 5;
const BLOQUEIO_MS = 15 * 60 * 1000; // 15 minutos

// 🧠 pega IP real (Render / Proxy / Local)
function getIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
}

// ================= 🚪 GUARDIÃO DA FRENTE (LOGIN) =================
app.post("/login", (req, res) => {
  const ip = getIP(req);
  const agora = Date.now();

  // 🔒 IP bloqueado temporariamente
  if (
    tentativas[ip] &&
    tentativas[ip].bloqueadoAte &&
    tentativas[ip].bloqueadoAte > agora
  ) {
    return res.status(429).json({
      erro: "Muitas tentativas. Tente novamente mais tarde 🚫"
    });
  }

  const { usuario, senha } = req.body;

  if (
    usuario !== process.env.USUARIO_ADMIN ||
    senha !== process.env.SENHA_ADMIN
  ) {
    // 📉 registra tentativa
    if (!tentativas[ip]) tentativas[ip] = { count: 0 };

    tentativas[ip].count++;

    // 🚫 bloqueia IP
    if (tentativas[ip].count >= LIMITE_TENTATIVAS) {
      tentativas[ip].bloqueadoAte = agora + BLOQUEIO_MS;
      tentativas[ip].count = 0;
    }

    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  // ✅ login ok → limpa tentativas
  delete tentativas[ip];

  const token = jwt.sign(
    { usuario, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// ================= 🚪 GUARDIÃO DOS FUNDOS (ROTAS PROTEGIDAS) =================
function guardiaoFundos(req, res, next) {
  const ip = getIP(req);

  // 🚫 bloqueio manual + automático
  if (
    sistema.ipsBloqueados.includes(ip) ||
    (tentativas[ip] && tentativas[ip].bloqueadoAte > Date.now())
  ) {
    return res.status(403).json({ erro: "Acesso bloqueado 🚫" });
  }

  next();
}

// 🔒 aplica nos caminhos sensíveis
app.use("/admin", guardiaoFundos);
app.use("/ia", guardiaoFundos);
app.use("/api", guardiaoFundos);
