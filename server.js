const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));

// LOGIN
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  // validação
  if (!email || !password) {

    return res.status(400).json({
      success: false,
      message: "Dados inválidos"
    });

  }

  // login simples
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {

    const token = jwt.sign(

      { email },

      process.env.JWT_SECRET,

      {
        expiresIn: "24h"
      }

    );

    return res.json({
      success: true,
      token,
      user: { email }
    });

  }

  return res.status(401).json({
    success: false,
    message: "Login inválido"
  });

});

// ROOT
app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "index.html"));

});

// IA
app.get("/ia", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "ia.html"));

});

// HEALTH
app.get("/health", (req, res) => {

  res.json({
    status: "ok"
  });

});

// PORTA
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`RUN OK ${PORT}`);

});
