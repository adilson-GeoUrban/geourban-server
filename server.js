const express = require("express");
const path = require("path");

const app = express();

// pasta pública
const publicPath = path.join(__dirname, "public");

// servir arquivos estáticos
app.use(express.static(publicPath));

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// fallback (SPA ou segurança)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
