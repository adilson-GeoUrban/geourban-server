const express = require("express");
const app = express();

app.use(express.json());

// 🔹 rota raiz
app.get("/", (req, res) => {
  res.send("GeoUrban API ativa 🚀");
});

// 🔹 health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "geourban-server"
  });
});

// 🔹 login controlado
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email e senha são obrigatórios"
    });
  }

  // 🔐 usuário de teste
  if (email === "admin@admin.com" && password === "123456") {
    return res.json({
      success: true,
      user: {
        nome: "Admin GeoUrban",
        email: email
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Credenciais inválidas"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
