const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico", "index.html"));
});

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
