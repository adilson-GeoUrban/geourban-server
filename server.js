const express = require("express");
const path = require("path");

const app = express();

// 🔥 força servir tudo da raiz SEM confusão
app.use(express.static(__dirname));

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ia
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// health check
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// fallback
app.use((req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
