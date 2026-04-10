const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const fs = require("fs");

const app = express();
app.use(express.json({ limit: "10kb" }));

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

// ✅ ROTA PRINCIPAL (IMPORTANTE)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================= IA =================
app.post("/ia", (req, res) => {
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const fs = require("fs");

const app = express();
app.use(express.json());

const SECRET = "geo_urban_chave_segura";

// ================= LOG ESTRUTURADO =================
function log(tipo, dados) {
  const registro = {
    tipo,
    data: new Date().toISOString(),
    ...dados
  };

  console.log(JSON.stringify(registro));

  // salva log em arquivo
  fs.appendFileSync("logs.txt", JSON.stringify(registro) + "\n");
}

// ================= MIDDLEWARE SEGURANÇA =================
app.use((req, res, next) => {
  // bloqueio básico de ataque
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "";

  if (!userAgent) {
    log("SEGURANCA", { ip, motivo: "sem user-agent" });
    return res.status(403).json({ erro: "Acesso negado" });
  }

  next();
});

// ================= BANCO =================
const db = new sqlite3.Database("./banco.db");

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
app.post("/ia", (req, res, next) => {
  try {

    const mensagemOriginal = req.body.mensagem || "";
    const mensagem = mensagemOriginal.toLowerCase();

    // 🔒 BLOQUEIO LEGAL
    const proibidos = ["ilegal", "fraude", "sonegar", "burlar"];

    for (let p of proibidos) {
      if (mensagem.includes(p)) {
        log("BLOQUEIO", { mensagem: mensagemOriginal });

        return res.json({
          resposta: "🚫 IA Jurídica: operação bloqueada."
        });
      }
    }

    let resposta = "🤖 IA GeoUrban ativa.\n";

    if (mensagem.includes("lei") || mensagem.includes("contrato")) {
      resposta = "⚖️ IA Jurídica: verificar legislação.";
    } 
    else if (mensagem.includes("importar") || mensagem.includes("exportar")) {
      resposta = "🌍 Operação internacional exige regras fiscais.";
    } 
    else if (mensagem.includes("imposto")) {
      resposta = "📊 IA Contábil: avaliar regime tributário.";
    } 
    else if (mensagem.includes("erro") || mensagem.includes("bug")) {
      resposta = "🛠 IA Técnica: verificar sistema.";
    } 
    else if (mensagem.includes("tela")) {
      resposta = "🎨 IA Designer: ajustar layout.";
    }

    // criptografia
    const criptografado = CryptoJS.AES.encrypt(mensagemOriginal, SECRET).toString();

    db.run(
      "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
      [criptografado, new Date().toISOString()],
      (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        log("IA", { mensagem: mensagemOriginal });

        res.json({ resposta });
      }
    );

  } catch (erro) {
    next(erro);
  }
});

// ================= LISTAR =================
app.get("/operacoes", (req, res, next) => {
  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {

    if (err) {
      log("ERRO_DB", { erro: err.message });
      return next(err);
    }

    const dados = rows.map(r => ({
      ...r,
      mensagem: CryptoJS.AES.decrypt(r.mensagem, SECRET).toString(CryptoJS.enc.Utf8)
    }));

    res.json(dados);
  });
});

// ================= BACKUP =================
setInterval(() => {
  try {
    const origem = "./banco.db";
    const destino = "./backup_" + Date.now() + ".db";

    fs.copyFile(origem, destino, (err) => {
      if (err) {
        log("ERRO_BACKUP", { erro: err.message });
      } else {
        log("BACKUP", { arquivo: destino });
      }
    });
  } catch (e) {
    log("ERRO_BACKUP", { erro: e.message });
  }
}, 60000);

// ================= TRATAMENTO GLOBAL DE ERRO =================
app.use((err, req, res, next) => {
  log("ERRO_GLOBAL", {
    rota: req.url,
    erro: err.message
  });

  res.status(500).json({
    erro: "Erro interno do servidor"
  });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log("START", { porta: PORT });
});
  const mensagemOriginal = req.body.mensagem || "";

  if (!mensagemOriginal) {
    return res.json({ resposta: "Digite uma mensagem." });
  }

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

  if (mensagem.includes("lei") || mensagem.includes("contrato")) {
    resposta = "⚖️ IA Jurídica: verifique legislação e documentação.";
  }
  else if (mensagem.includes("importar") || mensagem.includes("exportar")) {
    resposta = "🌍 Operação internacional exige NCM, impostos e licenças.";
  }
  else if (mensagem.includes("imposto")) {
    resposta = "📊 IA Contábil: avaliar regime tributário.";
  }
  else if (mensagem.includes("erro") || mensagem.includes("bug")) {
    resposta = "🛠 IA Técnica: verificar sistema.";
  }
  else if (mensagem.includes("tela")) {
    resposta = "🎨 IA Designer: ajustar layout.";
  }

  // 💾 SALVAR CRIPTOGRAFADO
  const criptografado = CryptoJS.AES.encrypt(mensagemOriginal, SECRET).toString();

  db.run(
    "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
    [criptografado, new Date().toISOString()],
    (err) => {
      if (err) console.log("Erro ao salvar:", err);
    }
  );

  res.json({ resposta });

});

// ================= LISTAR =================
app.get("/operacoes", (req, res) => {

  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {

    if (err) {
      console.log("Erro ao buscar:", err);
      return res.json([]);
    }

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
    if (err) {
      console.log("Erro no backup:", err);
    } else {
      console.log("Backup criado:", destino);
    }
  });

}, 60000);

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
