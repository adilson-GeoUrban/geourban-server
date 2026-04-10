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

  // BLOQUEIO
  if (mensagem.includes("ilegal") || mensagem.includes("fraude")) {
    return res.json({ resposta: "🚫 Operação bloqueada" });
  }

  let resposta = "IA ativa\n";

  if (mensagem.includes("importar")) {
    resposta += "🌍 Importação exige impostos e regularização.";
  }

  // SALVAR NO BANCO
  db.run(
    "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
    [mensagem, new Date().toISOString()]
  );

  res.json({ resposta });
});

// ================= LISTAR =================
app.get("/operacoes", (req, res) => {
  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {
    res.json(rows);
  });
});

// ================= START =================
app.listen(3000, () => {
  console.log("Rodando em http://localhost:3000");
});
