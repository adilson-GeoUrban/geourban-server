const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// ================= 🧠 ESTADO DO SISTEMA =================
const sistema = {
  modo: "BASICO", // BASICO | HIBRIDO | OTP_ONLY
  otpLiberado: false,
  ipsBloqueados: []
};

// ================= 🚫 FIREWALL =================
function firewallIP(req, res, next) {
  if (sistema.ipsBloqueados.includes(req.ip)) {
    return res.status(403).json({ erro: "IP bloqueado 🚫" });
  }
  next();
}

app.use(firewallIP);

// ================= 🔑 LOGIN =================
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (
    usuario !== process.env.USUARIO_ADMIN ||
    senha !== process.env.SENHA_ADMIN
  ) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { usuario, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// ================= 🔐 TOKEN =================
function verificarToken(req, res, next) {
  const auth = req.headers["authorization"];

  if (!auth) return res.status(403).json({ erro: "Sem token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// ================= 🛡️ ADMIN =================
function isAdmin(req, res, next) {
  if (!req.usuario || req.usuario.role !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito 🔒" });
  }
  next();
}

// ================= 📊 API TESTE =================
app.get("/api/teste", verificarToken, (req, res) => {
  res.json({
    status: "API funcionando 🔐",
    usuario: req.usuario
  });
});

// ================= ⚙️ ADMIN =================

// status geral
app.get("/admin/status", verificarToken, isAdmin, (req, res) => {
  res.json(sistema);
});

// mudar modo
app.post("/admin/modo", verificarToken, isAdmin, (req, res) => {
  sistema.modo = req.body.modo;
  res.json({ ok: true, sistema });
});

// ativar OTP (standby)
app.post("/admin/otp", verificarToken, isAdmin, (req, res) => {
  sistema.otpLiberado = req.body.ativo;
  res.json({ ok: true, sistema });
});

// bloquear IP
app.post("/admin/bloquear-ip", verificarToken, isAdmin, (req, res) => {
  const { ip } = req.body;

  if (!sistema.ipsBloqueados.includes(ip)) {
    sistema.ipsBloqueados.push(ip);
  }

  res.json({ ok: true, sistema });
});

// liberar IP
app.post("/admin/liberar-ip", verificarToken, isAdmin, (req, res) => {
  const { ip } = req.body;

  sistema.ipsBloqueados = sistema.ipsBloqueados.filter(i => i !== ip);

  res.json({ ok: true, sistema });
});

// ================= 🤖 IA DESIGNER (BASE) =================
app.get("/ia/status", verificarToken, isAdmin, (req, res) => {
  res.json({
    ia: "Luiza",
    status: "ativa",
    modo: sistema.modo
  });
});

// ================= 🚀 SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 GeoUrban rodando na porta:", PORT);
});
