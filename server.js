// ================= 🔐 IMPORTS =================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// ================= 🔒 SEGURANÇA =================
app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
  origin: [
    "https://geourban-oficial.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "10kb" }));

// ================= 🚫 RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// ================= 🌐 FRONTEND =================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================= 🔐 SANITIZAÇÃO =================
function limparEntrada(texto) {
  return texto
    .replace(/[<>]/g, "") // remove tags
    .replace(/script/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

// ================= 🔐 IA CENTRAL =================
app.post("/ia", (req, res) => {

  let mensagem = (req.body.mensagem || "").toString().toLowerCase().trim();
  mensagem = limparEntrada(mensagem);

  // 🔒 validação forte
  if (!mensagem || mensagem.length > 200) {
    return res.json({
      mensagem: "⚠️ Entrada inválida."
    });
  }

  // 🚫 bloqueio legal
  const proibidos = ["fraude", "ilegal", "burlar", "sonegar"];
  if (proibidos.some(p => mensagem.includes(p))) {
    return res.json({
      mensagem: "🚫 Operação bloqueada por segurança jurídica."
    });
  }

  let resposta = "🤖 GeoUrban ativa. Informe sua necessidade.";
  let acao = null;
  let destino = null;

  // ================= 🔐 FLUXO =================
  if (mensagem.includes("login")) {
    resposta = "🔐 Redirecionando para login...";
    acao = "REDIRECT";
    destino = "/login.html";
  }

  else if (mensagem.includes("cadastro")) {
    resposta = "📝 Iniciando cadastro...";
    acao = "REDIRECT";
    destino = "/login.html";
  }

  // ================= ⚖️ ESPECIALIZAÇÃO =================
  else if (mensagem.includes("lei") || mensagem.includes("direito")) {
    resposta = "⚖️ IA Jurídica: consulte legislação atualizada.";
  }

  else if (mensagem.includes("imposto")) {
    resposta = "📊 IA Contábil: avalie regime tributário.";
  }

  else if (mensagem.includes("importar") || mensagem.includes("exportar")) {
    resposta = "🌍 IA Internacional: verificar NCM e taxas.";
  }

  else if (mensagem.includes("erro") || mensagem.includes("bug")) {
    resposta = "🛠 IA Técnica: revisar backend e integração.";
  }

  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA UI: revisar layout e responsividade.";
  }

  // ================= 🔐 LOG LGPD =================
  console.log(JSON.stringify({
    tipo: "IA_LOG",
    mensagem: mensagem,
    resposta: resposta,
    acao: acao,
    destino: destino,
    ip: req.ip,
    data: new Date().toISOString()
  }));

  // ================= 🔐 RESPOSTA FINAL =================
  return res.json({
    mensagem: resposta,
    acao,
    destino
  });

});

// ================= 🚀 START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 GeoUrban IA BLINDADA rodando");
});
