const express = require("express");
const path = require("path");

const app = express();

// IMPORTANTE: servir arquivos corretamente
app.use(express.static(__dirname));

// rota raiz (LOGIN)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// outras páginas
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// health obrigatório Railway
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// fallback seguro (evita Not Found seco)
app.use((req, res) => {
  res.redirect("/");
});

// PORTA RAILWAY (CRÍTICO)
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
