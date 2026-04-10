const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// ================= BANCO =================
const db = new sqlite3.Database("./banco.db");

db.run(`
CREATE TABLE IF NOT EXISTS operacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mensagem TEXT,
  data TEXT
)
`);

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "public")));

// ================= IA =================
app.post("/ia", (req, res) => {

  const mensagem = (req.body.mensagem || "").toLowerCase();

  // 🔒 BLOQUEIO LEGAL
  const proibidos = ["ilegal", "fraude", "sonegar", "burlar"];

  for (let p of proibidos) {
    if (mensagem.includes(p)) {
      return res.json({
        resposta: "🚫 IA Jurídica: operação bloqueada por possível ilegalidade."
      });
    }
  }

  let resposta = "🤖 IA GeoUrban ativa.\n";

  // ⚖️ IA JURÍDICA
  if (
    mensagem.includes("lei") ||
    mensagem.includes("direito") ||
    mensagem.includes("contrato") ||
    mensagem.includes("processo")
  ) {
    resposta = `
⚖️ IA Jurídica

- Verificar legislação aplicável
- Validar documentação
- Consultar profissional habilitado

⚠️ Uso orientativo
`;
  }

  // 🌍 INTERNACIONAL
  else if (
    mensagem.includes("importar") ||
    mensagem.includes("exportar")
  ) {
    resposta = `
🌍 Operação Internacional

- Classificação NCM obrigatória
- Impostos (II + ICMS)
- Possível licenciamento

⚖️ Seguir legislação vigente
`;
  }

  // 📊 CONTÁBIL
  else if (mensagem.includes("imposto")) {
    resposta = `
📊 IA Contábil

- Avaliar regime tributário
- Simples / Lucro Presumido

⚠️ Consultar contador
`;
  }

  // 🛠 TÉCNICO
  else if (
    mensagem.includes("erro") ||
    mensagem.includes("bug")
  ) {
    resposta = "🛠 IA Técnica: verificar backend, rotas e arquivos.";
  }

  // 🎨 DESIGN
  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA Designer: ajustar layout e responsividade.";
  }

  // 🤖 PADRÃO
  else {
    resposta = "🤖 IA GeoUrban pronta. Informe melhor sua necessidade.";
  }

  // 💾 SALVAR NO BANCO
  db.run(
    "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
    [mensagem, new Date().toISOString()]
  );

  res.json({ resposta });

});

// ================= LISTAR =================
app.get("/operacoes", (req, res) => {
  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.json([]);
    }
    res.json(rows);
  });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
