const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// permitir JSON
app.use(express.json());

// servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// start servidor
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
