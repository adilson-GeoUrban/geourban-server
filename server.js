const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 credenciais teste
const USER = "usuario_teste";
const PASS = "senha_teste";

// 📂 servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🔑 rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER && password === PASS) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
