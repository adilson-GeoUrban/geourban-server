const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 credenciais do Railway
const USER = process.env.USER_LOGIN;
const PASS = process.env.ADMIN_PASS;

// 📂 servir arquivos HTML
app.use(express.static(path.join(__dirname, "public")));

// 🔑 rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER && password === PASS) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
