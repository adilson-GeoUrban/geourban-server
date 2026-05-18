const express = require("express");
const path = require("path");

const app = express();

// 🔥 IMPORTANTE: pasta correta de arquivos
app.use(express.static(path.join(__dirname)));

// 🔥 rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

// health Railway
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// fallback
app.use((req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
