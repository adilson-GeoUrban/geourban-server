const express = require("express");
const path = require("path");

const app = express();

// arquivos estáticos
app.use(express.static(__dirname));

// 🔥 GARANTE QUE "/" FUNCIONE SEM FALHA
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// páginas
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// health check obrigatório Railway
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// fallback seguro
app.use((req, res) => {
  res.redirect("/");
});

// PORTA RAILWAY (OBRIGATÓRIO)
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
