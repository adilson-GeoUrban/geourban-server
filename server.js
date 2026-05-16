process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

const app = express();

// 🧠 segurança básica
app.disable("x-powered-by");

app.use(cors());
app.use(express.json());

// 📦 frontend estático
app.use(express.static(path.join(__dirname, "public")));

// 🔐 ENV CHECK
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET não definido! Usando fallback dev");
}

// 🔥 HEALTH CHECK (Render usa isso para saber se está vivo)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "geourban",
    uptime: process.uptime()
  });
});

// 🔥 ROOT (frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  // 🔑 credencial fixa (dev)
  if (email === "admin@admin.com" && password === "123456") {

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      token,
      user: { email }
    });
  }

  return res.status(401).json({
    success: false,
    message: "invalid_credentials"
  });
});

// 🚀 PORTA RENDER (CRÍTICO)
const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ PORT não definida pelo Render");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 GeoUrban rodando na porta:", PORT);
});
