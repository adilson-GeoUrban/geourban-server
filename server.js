const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 SERVE ARQUIVOS
app.use(express.static(path.join(__dirname, "public")));

// 🔥 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 ROTA IA
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ia.html"));
});

// 🔥 PROTEÇÃO DE ERRO
process.on("uncaughtException", (err) => {
  console.error("Erro capturado:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Erro promessa:", err);
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
