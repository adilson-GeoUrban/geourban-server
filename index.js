const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const fs = require("fs");

const app = express();
app.use(express.json({ limit: "10kb" }));

// 🔐 CHAVE
const SECRET = process.env.SECRET || "geo_urban_local";

// ================= TIMEOUT =================
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).json({ erro: "Tempo de requisição esgotado" });
  });
  next();
});

// ================= LOG =================
function log(tipo, dados) {
  const registro = {
    tipo,
    data: new Date().toISOString(),
    ...dados
  };

  console.log(JSON.stringify(registro));
  fs.appendFileSync("logs.txt", JSON.stringify(registro) + "\n");
}

// ================= SEGURANÇA =================
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";

  if (!userAgent) {
    log("SEGURANCA", { motivo: "sem user-agent" });
    return res.status(403).json({ erro: "Acesso negado" });
  }

  next();
});

// ================= CONTROLE DE REQUISIÇÕES =================
let requisicoes = {};

app.use((req, res, next) => {
  const ip = req.ip;

  if (!requisicoes[ip]) {
    requisicoes[ip] = { count: 1, tempo: Date.now() };
  } else {
    requisicoes[ip].count++;
  }

  if (requisicoes[ip].count > 20 && (Date.now() - requisicoes[ip].tempo < 10000)) {
    log("RATE_LIMIT", { ip });
    return res.status(429).json({ erro: "Muitas requisições. Aguarde." });
  }

  if (Date.now() - requisicoes[ip].tempo > 10000) {
    requisicoes[ip] = { count: 1, tempo: Date.now() };
  }

  next();
});

// ================= BANCO =================
const db = new sqlite3.Database("./banco.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA busy_timeout = 5000;");
  db.run(`
    CREATE TABLE IF NOT EXISTS operacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem TEXT,
      data TEXT
    )
  `);
});

// ================= FILA (CONCORRÊNCIA REAL) =================
let fila = [];
let processando = false;

function processarFila() {
  if (processando || fila.length === 0) return;

  processando = true;

  const { mensagem, callback } = fila.shift();

  const criptografado = CryptoJS.AES.encrypt(mensagem, SECRET).toString();

  db.run(
    "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
    [criptografado, new Date().toISOString()],
    (err) => {
      processando = false;
      callback(err);
      processarFila();
    }
  );
}

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================= IA =================
app.post("/ia", (req, res, next) => {
  try {
    const mensagemOriginal = req.body.mensagem || "";

    if (!mensagemOriginal) {
      return res.json({ resposta: "Digite uma mensagem." });
    }

    const mensagem = mensagemOriginal.toLowerCase();

    const proibidos = ["ilegal", "fraude", "sonegar", "burlar"];

    for (let p of proibidos) {
      if (mensagem.includes(p)) {
        log("BLOQUEIO", { mensagem: mensagemOriginal });
        return res.json({ resposta: "🚫 IA Jurídica: operação bloqueada." });
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

    // 🔥 FILA (AO INVÉS DE DB DIRETO)
    fila.push({
      mensagem: mensagemOriginal,
      callback: (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        log("IA", { mensagem: mensagemOriginal });
        res.json({ resposta });
      }
    });

    processarFila();

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
  const origem = "./banco.db";
  const destino = "./backup_" + Date.now() + ".db";

  fs.copyFile(origem, destino, (err) => {
    if (err) {
      log("ERRO_BACKUP", { erro: err.message });
    } else {
      log("BACKUP", { arquivo: destino });
    }
  });
}, 60000);

// ================= ERRO GLOBAL =================
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
