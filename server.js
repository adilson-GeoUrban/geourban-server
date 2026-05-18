const express = require("express");
const path = require("path");

const app = express();

// 🔥 IMPORTANTE: servir arquivos corretamente
app.use(express.static(__dirname));

// 🟢 ROTA PRINCIPAL (LOGIN)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// 🟢 DASHBOARD
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🟢 IA PAGE
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// 🟢 HEALTH CHECK (Railway obrigatório)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "GeoUrban" });
});

// ❗ IMPORTANTE: fallback evita “Not Found” seco
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "login.html"));
});

// 🚀 PORTA RAILWAY
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`GeoUrban rodando na porta ${PORT}`);
});
