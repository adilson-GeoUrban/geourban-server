const express = require("express");
const path = require("path");

const app = express();

// arquivos estáticos (CSS, JS, imagens)
app.use(express.static(__dirname));

// 🔥 ROTA PRINCIPAL → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// dashboard (se existir fluxo depois)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ia
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// health check Railway
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// porta Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
