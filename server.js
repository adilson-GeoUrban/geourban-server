// ================= 🔐 IMPORTS =================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// ================= 🚀 APP =================
const app = express();

// ================= 🔐 SEGURANÇA =================

// Oculta tecnologia
app.disable("x-powered-by");

// Headers de segurança
app.use(helmet());

// CORS controlado (produção)
app.use(cors({
  origin: ["https://geourban-oficial.onrender.com"],
  methods: ["GET", "POST"],
  credentials: true
}));

// JSON
app.use(express.json());

// Anti ataque (rate limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições, tente novamente mais tarde."
});
app.use(limiter);

// ================= 🌐 FRONTEND =================

// Servir arquivos do /public
app.use(express.static(path.join(__dirname, "public")));

// ================= 🧪 ROTA TESTE =================

app.get("/", (req, res) => {
  res.send("GeoUrban API ONLINE ✅");
});

// ================= 🧠 LOGIN INTELIGENTE =================

app.post("/login", (req, res) => {
  const { comando } = req.body;

  if (!comando) {
    return res.status(400).json({
      mensagem: "Dados inválidos"
    });
  }

  const cmd = comando.toLowerCase();

  // 🔐 LOGIN
  if (cmd === "login") {
    return res.json({
      mensagem: "Login executado",
      acao: "REDIRECT",
      destino: "/dashboard.html"
    });
  }

  // 📝 CADASTRO
  if (cmd === "cadastro") {
    return res.json({
      mensagem: "Redirecionando para cadastro",
      acao: "REDIRECT",
      destino: "/login.html"
    });
  }

  // 🤖 RESPOSTA PADRÃO
  return res.json({
    mensagem: "Comando não reconhecido. Digite LOGIN ou CADASTRO."
  });
});

// ================= 🚀 START =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
