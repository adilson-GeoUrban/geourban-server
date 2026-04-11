const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ================= 🔐 SEGURANÇA BASE =================
app.use(helmet());
app.disable("x-powered-by");

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ================= 🔒 CORS PROFISSIONAL =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://geourbanapp.com.br",
  "https://www.geourbanapp.com.br"
];

// 🔒 subdomínios
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?geourbanapp\.com\.br$/i;

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) {
      return callback(null, true);
    }

    let originNormalizado;

    try {
      originNormalizado = origin.toLowerCase();
    } catch {
      return callback(new Error("CORS_BLOCK"));
    }

    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ================= 📦 BODY =================
app.use(express.json());

// ================= 🔐 ROTA PROTEGIDA =================
app.use("/api", (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token !== process.env.TOKEN_SEGURO) {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  next();
});

// ================= 🚀 PORTA (RENDER) =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
