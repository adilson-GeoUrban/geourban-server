const express = require("express");
const path = require("path");

const app = express();

// static
app.use(express.static(__dirname));

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// 🔥 HEALTH CHECK FORÇADO (CRÍTICO NO RAILWAY)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// fallback
app.use((req, res) => {
  res.redirect("/");
});

// PORTA RAILWAY
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});

// 🔥 MANTER PROCESSO VIVO (IMPORTANTE NO RAILWAY)
setInterval(() => {}, 1000 * 60 * 60);
