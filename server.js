// ================= 🟩 BACKEND (server.js) =================
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public")); // 🔥 serve login.html, admin.html, bg.jpg

// ================= 🧠 ESTADO =================
const sistema = {
  modo: "BASICO",
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
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
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

// ================= 📊 API =================
app.get("/api/teste", verificarToken, (req, res) => {
  res.json({ status: "OK 🔐", usuario: req.usuario });
});

// ================= 📊 AUDITORIA =================
app.get("/admin/auditoria", verificarToken, isAdmin, (req, res) => {
  res.json({
    status: "OK",
    modo: sistema.modo,
    otp: sistema.otpLiberado,
    ipsBloqueados: sistema.ipsBloqueados.length,
    data: new Date().toISOString()
  });
});

// ================= 💾 BACKUP =================
app.get("/admin/backup", verificarToken, isAdmin, (req, res) => {
  const backup = {
    sistema,
    data: new Date().toISOString()
  };

  fs.writeFileSync("backup.json", JSON.stringify(backup, null, 2));

  res.json({ ok: true, msg: "Backup salvo ✔" });
});

// ================= 🤖 IA DESIGNER =================
app.get("/ia/designer", verificarToken, isAdmin, (req, res) => {
  const resposta = {
    ia: "Luiza",
    acao: "monitorando sistema",
    recomendacoes: []
  };

  if (sistema.ipsBloqueados.length > 5) {
    resposta.recomendacoes.push("Muitos IPs bloqueados 🚫");
  }

  if (!sistema.otpLiberado) {
    resposta.recomendacoes.push("Ativar OTP 🔐");
  }

  if (sistema.modo === "BASICO") {
    resposta.recomendacoes.push("Migrar para HIBRIDO ⚠️");
  }

  res.json(resposta);
});

// ================= 🚀 SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Rodando:", PORT));
