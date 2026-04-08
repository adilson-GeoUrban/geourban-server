require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Liberar arquivos da pasta public
app.use(express.static("public"));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
