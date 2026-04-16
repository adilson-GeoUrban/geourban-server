const express = require("express");
const app = express();

// permite receber JSON
app.use(express.json());

// 🔓 libera acesso entre frontend e backend (CORS aberto p/ teste)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

// 🔍 ROTA DE TESTE
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔐 LOGIN SIMPLES (SEM SENHA - TESTE)
app.post("/login", (req, res) => {
  const { email } = req.body;

  res.json({
    success: true,
    user: {
      nome: "Admin Teste",
      email: email || "teste@admin.com"
    }
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
