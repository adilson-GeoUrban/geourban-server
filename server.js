process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// 🔐 ENV CHECK (evita deploy silencioso quebrado)
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET não definido!");
}

// 🔥 HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "geourban",
    uptime: process.uptime()
  });
});

// 🔥 ROOT
app.get("/", (req, res) => {
  res.status(200).send("GeoUrban online");
});

// 🔐 LOGIN (AGORA COM JWT REAL)
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  // ⚠️ versão provisória (sem banco ainda)
  if (email === "admin@admin.com" && password === "123456") {

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      token
    });
  }

  return res.status(401).json({
    success: false,
    message: "invalid_credentials"
  });
});

// 🚀 SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
