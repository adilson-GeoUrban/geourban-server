const express = require("express");
const app = express();

app.use(express.json());

// teste raiz (IMPORTANTE)
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// login teste
app.post("/login", (req, res) => {
  const { email } = req.body;

  res.json({
    success: true,
    user: {
      nome: "Admin Teste",
      email: email || "teste@admin.com"
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
https://geourban-server-production.up.railway.app/health
