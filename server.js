const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🔥 GARANTIR CAMINHO ABSOLUTO
const publicPath = path.resolve(__dirname, "public");

// 🔍 LOG PRA DEBUG
console.log("Pasta pública:", publicPath);

// 🔥 SERVIR ARQUIVOS
app.use(express.static(publicPath));

// 🔥 ROTA RAIZ GARANTIDA
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// 🔥 TESTE DIRETO (FORÇADO)
app.get("/teste", (req, res) => {
    res.send("<h1>TESTE OK</h1>");
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
