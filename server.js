// 🟩 BACKEND (server.js)

const fs = require("fs");

// ================= 📊 AUDITORIA =================
app.get("/admin/auditoria", verificarToken, isAdmin, (req, res) => {
  const auditoria = {
    status: "OK",
    modo: sistema.modo,
    otp: sistema.otpLiberado,
    ipsBloqueados: sistema.ipsBloqueados.length,
    data: new Date().toISOString()
  };

  res.json(auditoria);
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
    resposta.recomendacoes.push("Ativar OTP recomendado 🔐");
  }

  if (sistema.modo === "BASICO") {
    resposta.recomendacoes.push("Migrar para HIBRIDO ⚠️");
  }

  res.json(resposta);
});
