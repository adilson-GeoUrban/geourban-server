const express = require("express");
const path = require("path");

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 health check (Render)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "geourban",
    uptime: process.uptime()
  });
});

// 🔥 raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔐 login simples (dev)
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (email === "admin@admin.com" && password === "123456") {
    return res.json({
      success: true,
      token: "geo-token-demo",
      user: { email }
    });
  }

  return res.status(401).json({
    success: false,
    message: "invalid_credentials"
  });
});

// 🚀 PORTA RENDER (OBRIGATÓRIO)
const PORT = process.env.PORT;

if (!PORT) {
  console.error("PORT não definida pelo Render");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("GeoUrban rodando na porta", PORT);
});
