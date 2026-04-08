const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 📁 servir arquivos da pasta "publico"
const publicPath = path.join(__dirname, "publico");
app.use(express.static(publicPath));

// 🏠 rota principal (OBRIGATÓRIA)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// 🛡 fallback (resolve qualquer rota)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// 🚀 start
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
