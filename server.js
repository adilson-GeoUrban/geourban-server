server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// 🔒 Middleware de segurança básica
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// 📂 Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🔐 Simulação de autenticação simples
function auth(req, res, next) {
  const autorizado = req.headers["x-auth"] === "geourban123";
  if (!autorizado) {
    return res.status(403).send("Acesso negado 🔒");
  }
  next();
}

// 🔑 Rota protegida (exemplo)
app.get("/admin", auth, (req, res) => {
  res.send("Painel administrativo seguro 🚀");
});

// 🌐 Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔁 Fallback (resolve Not Found)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Inicialização
app.listen(PORT, () => {
  console.log("Servidor seguro rodando na porta", PORT);
});
