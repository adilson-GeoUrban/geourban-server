const express = require("express");
const app = express();

app.use(express.json());

// 🔥 HEALTH ULTRA LEVE (Railway gosta disso)
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// 🔥 ROOT ULTRA SIMPLES (evita timeout)
app.get("/", (req, res) => {
  res.status(200).send("GeoUrban online");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (email === "admin@admin.com" && password === "123456") {
    return res.json({
      success: true,
      token: "geo-token-ok"
    });
  }

  return res.status(401).json({
    success: false,
    message: "invalid_credentials"
  });
});

// 🚀 START SERVER (OBRIGATÓRIO RAILWAY)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
