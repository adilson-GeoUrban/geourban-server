const express = require("express");
const path = require("path");

const app = express();

// 🔓 Permitir JSON (necessário pro login/cadastro)
app.use(express.json());

// 🔥 SERVIR ARQUIVOS DA PASTA PUBLIC
app.use(express.static(path.join(__dirname, "public")));

// 🏠 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// 🔐 LOGIN (teste simples)
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "123") {
    return res.json({ ok: true });
  }

  res.status(401).json({ erro: "Login inválido" });
});

// 📝 CADASTRO (teste)
app.post("/cadastro", (req, res) => {
  res.json({ ok: true });
});

// 📋 LOG (auditoria)
app.post("/log", (req, res) => {
  console.log("LOG:", req.body);
  res.json({ ok: true });
});

// 🚀 START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
