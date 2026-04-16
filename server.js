const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// servir frontend
app.use(express.static(path.join(__dirname, "public")));

// rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Preencha email e senha"
    });
  }

  if (email === "admin@admin.com" && password === "123456") {
    return res.json({
      success: true,
      user: { email }
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
