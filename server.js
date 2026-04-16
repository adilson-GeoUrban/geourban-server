const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// servir frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === "123456") {
    return res.json({
      success: true,
      user: { email }
    });
  }

  return res.status(401).json({
    success: false
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
