const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// ================= 🔐 SECRET =================
const SECRET = process.env.SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

if (!SECRET || !JWT_SECRET) {
  console.error("❌ SECRET ou JWT_SECRET não definida!");
  process.exit(1);
}

// ================= SEGURANÇA =================
app.use(helmet());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));

// ================= 🔐 LOGIN =================
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  // 🔒 TEMPORÁRIO
  if (usuario === "admin" && senha === "123") {

    const token = jwt.sign(
      { usuario },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  return res.status(401).json({ erro: "Credenciais inválidas" });
});

// ================= 🔐 PROTEGER =================
function proteger(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ erro: "Token ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// ================= RATE LIMIT =================
let requisicoes = {};

app.use((req, res, next) => {
  const ip = req.ip;

  if (!requisicoes[ip]) {
    requisicoes[ip] = { count: 1, tempo: Date.now() };
  } else {
    requisicoes[ip].count++;
  }

  if (requisicoes[ip].count > 20 && (Date.now() - requisicoes[ip].tempo < 10000)) {
    return res.status(429).json({ erro: "Muitas requisições" });
  }

  if (Date.now() - requisicoes[ip].tempo > 10000) {
    requisicoes[ip] = { count: 1, tempo: Date.now() };
  }

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

  db.run(`
    CREATE TABLE IF NOT EXISTS cadastros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      escolaridade TEXT,
      profissao TEXT,
      limitacoes TEXT,
      registro TEXT,
      data TEXT
    )
  `);
});

// ================= FRONT =================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================= IA MÓDULOS =================
function iaJuridica(msg) {
  if (msg.includes("lei") || msg.includes("contrato")) {
    return "⚖️ IA Jurídica: verificar legislação.";
  }
  return null;
}

function iaContabil(msg) {
  if (msg.includes("imposto")) {
    return "📊 IA Contábil: avaliar regime tributário.";
  }
  return null;
}

function iaTecnica(msg) {
  if (msg.includes("erro") || msg.includes("bug")) {
    return "🛠 IA Técnica: verificar sistema.";
  }
  if (msg.includes("tela")) {
    return "🎨 IA Designer: ajustar layout.";
  }
  return null;
}

// ================= IA GLOBAL =================
app.post("/ia", proteger, (req, res, next) => {
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
        return res.json({ resposta: "🚫 Operação bloqueada." });
      }
    }

    let resposta =
      iaJuridica(mensagem) ||
      iaContabil(mensagem) ||
      iaTecnica(mensagem) ||
      "🤖 IA GeoUrban ativa.";

    const criptografado = CryptoJS.AES.encrypt(mensagemOriginal, SECRET).toString();

    db.run(
      "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
      [criptografado, new Date().toISOString()],
      (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        log("IA", { entrada: mensagemOriginal, resposta });
        res.json({ resposta });
      }
    );

  } catch (erro) {
    next(erro);
  }
});

// ================= CADASTRO =================
app.post("/cadastro", (req, res, next) => {
  try {
    const {
      nome,
      escolaridade,
      profissao,
      limitacoes,
      registro,
      declaracao
    } = req.body;

    if (!nome || !escolaridade || !profissao || !limitacoes) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    const esc = escolaridade.toLowerCase();

    if ((esc.includes("tecnico") || esc.includes("superior")) && !registro) {
      return res.status(400).json({ erro: "Registro obrigatório" });
    }

    if (declaracao !== true) {
      return res.status(400).json({ erro: "Declaração obrigatória" });
    }

    const nomeCripto = CryptoJS.AES.encrypt(nome, SECRET).toString();
    const profCripto = CryptoJS.AES.encrypt(profissao, SECRET).toString();
    const limCripto = CryptoJS.AES.encrypt(limitacoes, SECRET).toString();
    const regCripto = registro
      ? CryptoJS.AES.encrypt(registro, SECRET).toString()
      : null;

    db.run(
      `INSERT INTO cadastros 
      (nome, escolaridade, profissao, limitacoes, registro, data)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nomeCripto,
        escolaridade,
        profCripto,
        limCripto,
        regCripto,
        new Date().toISOString()
      ],
      (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        log("CADASTRO", { nome });
        res.json({ ok: true });
      }
    );

  } catch (erro) {
    next(erro);
  }
});

// ================= LISTAR =================
app.get("/operacoes", proteger, (req, res) => {
  db.all("SELECT * FROM operacoes ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.json([]);

    const dados = rows.map(r => ({
      ...r,
      mensagem: CryptoJS.AES.decrypt(r.mensagem, SECRET).toString(CryptoJS.enc.Utf8)
    }));

    res.json(dados);
  });
});

// ================= ERRO GLOBAL =================
app.use((err, req, res, next) => {
  log("ERRO_GLOBAL", {
    rota: req.url,
    erro: err.message
  });

  res.status(500).json({
    erro: "Erro interno"
  });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log("START", { porta: PORT });
});
