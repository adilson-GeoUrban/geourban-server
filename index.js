const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const fs = require("fs");

const app = express();
app.use(express.json());

const SECRET = "geo_urban_chave_segura";

// ================= BANCO =================
const db = new sqlite3.Database("./banco.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;");

  db.run(`
  CREATE TABLE IF NOT EXISTS operacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mensagem TEXT,
    data TEXT
  )
  `);
});

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "public")));

// ================= IA =================
app.post("/ia", (req, res) => {

  const mensagemOriginal = req.body.mensagem || "";
  const mensagem = mensagemOriginal.toLowerCase();

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

  // ⚖️ JURÍDICO
  if (mensagem.includes("lei") || mensagem.includes("contrato")) {
    resposta = "⚖️ IA Jurídica: verifique legislação e documentação.";
  }

  // 🌍 INTERNACIONAL
  else if (mensagem.includes("importar") || mensagem.includes("exportar")) {
    resposta = "🌍 Operação internacional exige NCM, impostos e licenças.";
  }

  // 📊 CONTÁBIL
  else if (mensagem.includes("imposto")) {
    resposta = "📊 IA Contábil: avaliar regime tributário.";
  }

  // 🛠 TÉCNICO
  else if (mensagem.includes("erro") || mensagem.includes("bug")) {
    resposta = "🛠 IA Técnica: verificar sistema.";
  }

  // 🎨 DESIGN
  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA Designer: ajustar layout.";
  }

  // 💾 SALVAR CRIPTOGRAFADO
  const criptografado = CryptoJS.AES.encrypt(mensagemOriginal, SECRET).toString();

  db.run(
    "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
    [criptografado, new Date().toISOString()]
  );

  res.json({ resposta });

});

// ================= LISTAR =================
app.get("/operacoes", (req, res) => {

  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {

    if (err) return res.json([]);

    const dados = rows.map(r => ({
      ...r,
      mensagem: CryptoJS.AES.decrypt(r.mensagem, SECRET).toString(CryptoJS.enc.Utf8)
    }));

    res.json(dados);

  });

});

// ================= BACKUP AUTOMÁTICO =================
setInterval(() => {

  const origem = "./banco.db";
  const destino = "./backup_" + Date.now() + ".db";

  fs.copyFile(origem, destino, (err) => {
    if (!err) console.log("Backup criado:", destino);
  });

}, 60000); // 1 minuto

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
