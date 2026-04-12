// IMPORTS
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// SEGURANÇA
app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
  origin: ["https://geourban-oficial.onrender.com"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// LOGIN
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

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando");
});
