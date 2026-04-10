const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================= "BANCO" (BASE INICIAL) =================
let operacoes = [];

// ================= REGRA LEGAL GLOBAL =================
function validarLegalidade(msg) {
  const proibidos = ["ilegal", "sonegar", "fraude", "burlar"];

  for (let p of proibidos) {
    if (msg.includes(p)) {
      return false;
    }
  }
  return true;
}

// ================= CALCULO SIMPLES DE IMPOSTO =================
function calcularImposto(valor) {
  const ii = valor * 0.60;   // Importação
  const icms = valor * 0.18; // ICMS médio
  const total = valor + ii + icms;

  return {
    valor,
    ii,
    icms,
    total
  };
}

// ================= IA CENTRAL =================
app.post("/ia", (req, res) => {
  const { mensagem } = req.body;

  // 🔒 BLOQUEIO AUTOMÁTICO
  if (!validarLegalidade(mensagem)) {
    return res.json({
      resposta: "⚠️ Operação bloqueada por possível ilegalidade."
    });
  }

  let resposta = "IA GeoUrban ativa.\n";

  // 🌍 IMPORTAÇÃO / EXPORTAÇÃO
  if (mensagem.includes("importar") || mensagem.includes("exportar")) {
    const valor = 1000; // exemplo padrão

    const calc = calcularImposto(valor);

    resposta += `
🌍 Operação internacional detectada

Valor base: R$ ${calc.valor}
Imposto Importação: R$ ${calc.ii}
ICMS: R$ ${calc.icms}
Total estimado: R$ ${calc.total}

⚖️ Necessário:
- Classificação NCM
- Verificação de licença
- Regularização fiscal
`;
  }

  // ⚖️ JURÍDICO
  else if (mensagem.includes("lei")) {
    resposta += "⚖️ Operação analisada conforme legislação brasileira.";
  }

  // 📊 CONTÁBIL
  else if (mensagem.includes("imposto")) {
    resposta += "📊 Consulte regime tributário adequado (Simples, Lucro Presumido).";
  }

  // 🛠 BUG / SISTEMA
  else if (mensagem.includes("erro") || mensagem.includes("bug")) {
    resposta += "🛠 Diagnóstico: verificar CSS, backend e carregamento de assets.";
  }

  // 🎨 DESIGN
  else if (mensagem.includes("tela")) {
    resposta += "🎨 Ajustar layout, centralização e responsividade.";
  }

  // ================= REGISTRO =================
  operacoes.push({
    mensagem,
    data: new Date()
  });

  res.json({ resposta });
});

// ================= API DE OPERAÇÕES =================
app.get("/operacoes", (req, res) => {
  res.json(operacoes);
});

// ================= LOGIN SIMPLES =================
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "123") {
    return res.json({ ok: true });
  }

  res.status(401).json({ erro: "Login inválido" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
<!DOCTYPE html>
<html>
<head>
<title>Painel GeoUrban</title>
</head>
<body>

<h2>Operações registradas</h2>
<div id="lista"></div>

<script>
fetch("/operacoes")
.then(r => r.json())
.then(data => {
  const div = document.getElementById("lista");

  data.forEach(op => {
    div.innerHTML += `<p>${op.data} - ${op.mensagem}</p>`;
  });
});
</script>

</body>
</html>
