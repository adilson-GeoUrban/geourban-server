const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 LOGIN (fixo)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === "123456") {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "dev-secret"
    );

    return res.json({
      success: true,
      token,
      user: { email }
    });
  }

  return res.json({ success: false });
});

// 🔥 ROOT
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 FORÇA IA SEM DEPENDER DE ARQUIVO DIRETO
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ia.html"));
});

// 🔥 HEALTH (Render check)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 PORTA RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("RUN OK", PORT);
});
