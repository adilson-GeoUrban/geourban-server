// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// ================= SEGURANÇA =================
app.disable("x-powered-by");
app.use(helmet());

// ⚠️ Permite produção + testes locais
app.use(cors({
  origin: [
    "https://geourban-oficial.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "public")));

// ================= HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================= IA (UNIFICADA) =================
app.post("/ia", (req, res) => {

  const mensagem = (req.body.mensagem || "").toLowerCase();

  // 🔒 BLOQUEIO LEGAL
  const proibidos = ["ilegal", "fraude", "sonegar", "burlar"];
  for (let p of proibidos) {
    if (mensagem.includes(p)) {
      return res.json({
        resposta: "🚫 IA Jurídica: operação bloqueada por possível ilegalidade."
      });
    }
  }

  let resposta = "🤖 IA GeoUrban pronta.";

  // ⚖️ JURÍDICO
  if (
    mensagem.includes("lei") ||
    mensagem.includes("direito") ||
    mensagem.includes("contrato") ||
    mensagem.includes("processo")
  ) {
    resposta = `⚖️ IA Jurídica:\n- Verificar legislação\n- Validar documentos\n- Consultar profissional`;
  }

  // 🌍 INTERNACIONAL
  else if (
    mensagem.includes("importar") ||
    mensagem.includes("exportar")
  ) {
    resposta = `🌍 Operação Internacional:\n- NCM\n- Impostos\n- Licenciamento`;
  }

  // 📊 CONTÁBIL
  else if (mensagem.includes("imposto")) {
    resposta = `📊 IA Contábil:\n- Regime tributário\n- Simples / Presumido`;
  }

  // 🛠 TÉCNICO
  else if (
    mensagem.includes("erro") ||
    mensagem.includes("bug")
  ) {
    resposta = "🛠 IA Técnica: verificar backend, rotas e integração.";
  }

  // 🎨 DESIGN
  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA Designer: ajustar layout e responsividade.";
  }

  return res.json({ resposta });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {

  const { comando } = req.body;

  if (!comando) {
    return res.status(400).json({ mensagem: "Dados inválidos" });
  }

  const cmd = comando.toLowerCase();

  if (cmd === "login") {
    return res.json({
      mensagem: "Abrindo tela de login",
      acao: "REDIRECT",
      destino: "/login.html"
    });
  }

  if (cmd === "cadastro") {
    return res.json({
      mensagem: "Redirecionando para cadastro",
      acao: "REDIRECT",
      destino: "/login.html"
    });
  }

  return res.json({
    mensagem: "Digite LOGIN ou CADASTRO."
  });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor GeoUrban rodando");
});
