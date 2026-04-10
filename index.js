geourban-server/
 ├── index.js
 └── public/
      ├── index.html
      ├── login.html
      ├── bg.jpg
const express = require("express");
const path = require("path");

const app = express();

// 🔥 ESSA LINHA É A CHAVE
app.use(express.static(path.join(__dirname, "public")));

// rota padrão
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
