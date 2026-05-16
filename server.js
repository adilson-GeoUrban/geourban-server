const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// 🔥 HEALTH
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "geourban",
    uptime: process.uptime()
  });
});

// 🔥 LOGIN (fixo seguro dev)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === "123456") {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      token,
      user: { email }
    });
  }

  return res.status(401).json({
    success: false
  });
});

// 🔥 ROOT SEM ERRO
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 FALLBACK IA (EVITA 404)
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ia.html"));
});

// 🚀 PORT RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Rodando na porta", PORT);
});
