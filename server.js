const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// 🔒 SEGURANÇA BÁSICA
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// 📂 ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// 🧠 IA MONITOR DE ERROS
// ===============================
let logsErros = [];

function registrarErro(erro) {
  const registro = {
    data: new Date().toISOString(),
    erro: erro.toString()
  };

  logsErros.push(registro);
  console.error("🚨 ERRO DETECTADO:", registro);
}

// Captura erros globais
process.on("uncaughtException", (err) => {
  registrarErro(err);
});

process.on("unhandledRejection", (err) => {
  registrarErro(err);
});

// ===============================
// 🧠 IA - STATUS
// ===============================
app.get("/ia/status", (req, res) => {
  const status = logsErros.length === 0
    ? "Sistema saudável"
    : "Erros detectados";

  res.json({
    status,
    totalErros: logsErros.length
  });
});

// ===============================
// 📊 IA - LISTAR ERROS
// ===============================
app.get("/ia/erros", (req, res) => {
  res.json({
    total: logsErros.length,
    erros: logsErros.slice(-10)
  });
});

// ===============================
// 🤖 IA COMANDO CONTROLADO
// ===============================
app.post("/ia/comando", (req, res) => {
  const comando = req.body?.comando;

  const comandosPermitidos = [
    "iniciar_sistema",
    "verificar_status",
    "modo_auditoria"
  ];

  if (!comando || !comandosPermitidos.includes(comando)) {
    return res.status(403).json({ erro: "Comando não autorizado" });
  }

  let resposta = "";

  switch (comando) {
    case "iniciar_sistema":
      resposta = "Sistema inicializado com sucesso";
      break;

    case "verificar_status":
      resposta = "Sistema operacional";
      break;

    case "modo_auditoria":
      resposta = "Auditoria ativada";
      break;
  }

  res.json({ sucesso: true, resposta });
});

// ===============================
// 🌐 ROTA PRINCIPAL
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 🔁 FALLBACK (ANTI NOT FOUND)
// ===============================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 🚀 START SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta", PORT);
});
