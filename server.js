const express = require("express");
const path = require("path");

const app = express();

// 🔥 SERVIR PUBLIC PRIMEIRO (CRÍTICO)
app.use(express.static(path.join(__dirname, "public")));

// 🔥 SE TIVER FRONTEND EM OUTRA PASTA
app.use(express.static(path.join(__dirname, "app/frontend")));

// 🔥 ROTAS PRINCIPAIS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "public/ia.html"));
});

// health
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// fallback seguro
app.use((req, res) => {
  res.redirect("/");
});

// PORTA RAILWAY
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
