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

app.use(express.json());

// ================= 🚫 RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⚠️ Muitas requisições. Tente novamente mais tarde."
});
app.use(limiter);

// ================= 🌐 FRONTEND =================
app.use(express.static(path.join(__dirname, "public")));

// ================= 🏠 HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================= 🧠 IA CENTRAL =================
app.post("/ia", (req, res) => {

  let mensagem = (req.body.mensagem || "").toLowerCase().trim();

  // 🔒 VALIDAÇÃO DE ENTRADA
  if (!mensagem || mensagem.length > 200) {
    return res.json({
      mensagem: "⚠️ Entrada inválida. Digite uma mensagem válida."
    });
  }

  // 🚫 BLOQUEIO LEGAL
  const proibidos = ["fraude", "ilegal", "burlar", "sonegar"];
  if (proibidos.some(p => mensagem.includes(p))) {
    return res.json({
      mensagem: "🚫 Operação bloqueada por segurança jurídica."
    });
  }

  let resposta = "🤖 GeoUrban ativa. Informe sua necessidade.";
  let acao = null;
  let destino = null;

  // ================= 🔐 FLUXO DE SISTEMA =================

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

  // ================= ⚖️ IA ESPECIALIZADA =================

  else if (
    mensagem.includes("lei") ||
    mensagem.includes("direito") ||
    mensagem.includes("contrato")
  ) {
    resposta = "⚖️ IA Jurídica: verifique legislação e consulte profissional habilitado.";
  }

  else if (mensagem.includes("imposto")) {
    resposta = "📊 IA Contábil: avalie regime tributário adequado.";
  }

  else if (
    mensagem.includes("importar") ||
    mensagem.includes("exportar")
  ) {
    resposta = "🌍 IA Internacional: verificar NCM, impostos e licenças.";
  }

  else if (
    mensagem.includes("erro") ||
    mensagem.includes("bug")
  ) {
    resposta = "🛠 IA Técnica: revisar backend, rotas e integração.";
  }

  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA Designer: ajustar layout e responsividade.";
  }

  // 📊 LOG (AUDITORIA LGPD)
  console.log(JSON.stringify({
    tipo: "IA_LOG",
    mensagem: mensagem,
    resposta: resposta,
    acao: acao,
    destino: destino,
    ip: req.ip,
    data: new Date().toISOString()
  }));

  // 🔁 RESPOSTA PADRÃO
  return res.json({
    mensagem: resposta,
    acao: acao,
    destino: destino
  });

});

// ================= 🚀 START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 GeoUrban rodando com IA ativa");
});
