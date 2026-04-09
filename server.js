const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Fallback (evita erro Not Found)
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

// Inicialização
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
