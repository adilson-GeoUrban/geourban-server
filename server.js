const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 segurança básica
app.use(helmet());

// 📁 servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// 🌐 rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 iniciar servidor
app.listen(PORT, () => {
  console.log("GeoUrban rodando na porta " + PORT);
});
