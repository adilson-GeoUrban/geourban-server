const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// servir pasta public
app.use(express.static(path.join(__dirname, "public")));

// rota principal -> abre ia.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ia.html"));
});

// rotas básicas
app.post("/login", (req, res) => {
  res.json({ token: "ok" });
});

app.post("/executar", (req, res) => {
  const ordem = req.body?.ordem || "";
  res.send("Executado: " + ordem);
});

app.get("/sala-secreta", (req, res) => {
  res.send("👑 Acesso autorizado");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
