const express = require("express");
const path = require("path");

const app = express();

// 🔥 servir arquivos estáticos
app.use(express.static(__dirname));

// 🟢 LOGIN (rota principal)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// 🟢 DASHBOARD
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🟢 IA
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// 🟢 HEALTH CHECK (Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 🔥 fallback seguro (qualquer rota inválida volta pro login)
app.use((req, res) => {
  res.redirect("/");
});

// 🚀 PORTA RAILWAY (OBRIGATÓRIO)
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GeoUrban rodando na porta ${PORT}`);
});
