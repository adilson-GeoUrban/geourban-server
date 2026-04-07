// 🚀 SISTEMA GEOURBAN — BLOCO ÚNICO CORRIGIDO

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// 📂 GARANTIR PASTA BACKUP
const pastaBackup = path.join(__dirname, "backup");
if (!fs.existsSync(pastaBackup)) {
  fs.mkdirSync(pastaBackup);
}

// 🛡️ PROTEÇÃO SIMPLES (SEM BLOQUEIO EXAGERADO)
function guardian(texto) {
  const proibidos = [
    "hack",
    "fraude",
    "ataque"
  ];

  texto = (texto || "").toLowerCase();

  for (let p of proibidos) {
    if (texto.includes(p)) {
      return { bloqueado: true, motivo: p };
    }
  }

  return { bloqueado: false };
}

// ⚖️ GOVERNANÇA LEVE (NÃO BLOQUEIA POR QUALQUER COISA)
function governar(texto) {
  texto = (texto || "").toLowerCase();

  if (texto.includes("erro crítico")) {
    return { permitido: false };
  }

  return { permitido: true };
}

// 🧠 IA PRINCIPAL
function sistema(dados) {
  try {
    const descricao = dados?.descricao || "";

    // 🔴 PROTEÇÃO
    const g = guardian(descricao);
    if (g.bloqueado) {
      return {
        status: "bloqueado",
        motivo: "Termo sensível detectado: " + g.motivo
      };
    }

    // 🟡 GOVERNANÇA
    const gov = governar(descricao);
    if (!gov.permitido) {
      return {
        status: "bloqueado",
        motivo: "Regra interna acionada"
      };
    }

    // 🟢 EXECUÇÃO NORMAL
    return {
      status: "ok",
      resposta: "Sistema funcionando 🚀",
      recebido: descricao
    };

  } catch (erro) {
    return {
      status: "erro",
      mensagem: erro.message
    };
  }
}

// 📡 ROTA PRINCIPAL
app.post("/solicitar", (req, res) => {
  const dados = req.body;

  const resultado = sistema(dados);

  if (resultado.status === "bloqueado") {
    return res.status(403).json(resultado);
  }

  res.json(resultado);
});

// 🌐 ROTA TESTE
app.get("/", (req, res) => {
  res.send("✅ GeoUrban rodando normal (sem bloqueio excessivo)");
});

// ▶️ INICIAR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
