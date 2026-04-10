const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// ================= 🔐 SEGREDOS =================
const SECRET = process.env.SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

if (!SECRET || !JWT_SECRET) {
  console.error("❌ SECRET ou JWT_SECRET não definida!");
  process.exit(1);
}

// ================= SEGURANÇA =================
app.use(helmet());

// 🔒 CORS FECHADO
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (ORIGENS_PERMITIDAS.includes(origin)) {
      return callback(null, true);
    }

    log("CORS_BLOQUEADO", { origin });
    return callback(new Error("CORS_BLOCK"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10kb" }));

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

// ================= ROBÔ PROTEÇÃO =================
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip;

  if (!userAgent || userAgent.length < 10) {
    log("ROBO_BLOQUEIO", { tipo: "user-agent inválido", ip });
    return res.status(403).json({ erro: "Acesso negado" });
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

// ================= HASH =================
function hashSeguro(valor) {
  return crypto
    .createHash("sha256")
    .update(valor)
    .digest("hex");
}

// ================= BANCO =================
const db = new sqlite3.Database("./banco.db");

db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;");

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT,
      senha TEXT,
      nivel TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cadastros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      nome_hash TEXT,
      escolaridade TEXT,
      profissao TEXT,
      limitacoes TEXT,
      registro TEXT,
      data TEXT
    )
  `);

  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_nome_unico
    ON cadastros(nome_hash)
  `);
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  db.get(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, user) => {

      if (!user) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      // ⚠️ (simples agora — depois trocamos por bcrypt)
      if (senha !== user.senha) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          nivel: user.nivel
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

// ================= PROTEGER =================
function proteger(req, res, next) {
  const auth = req.headers["authorization"];

  if (!auth) return res.status(401).json({ erro: "Token ausente" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// ================= AUTORIZAR =================
function autorizar(perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario.nivel)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }
    next();
  };
}

// ================= CADASTRO =================
app.post("/cadastro",
  proteger,
  autorizar(["admin", "tecnico"]),
  (req, res, next) => {

    try {

      let {
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro,
        declaracao
      } = req.body;

      const usuario = req.usuario;

      nome = typeof nome === "string" ? nome.trim() : "";
      escolaridade = typeof escolaridade === "string" ? escolaridade.trim() : "";
      profissao = typeof profissao === "string" ? profissao.trim() : "";
      limitacoes = typeof limitacoes === "string" ? limitacoes.trim() : "";
      registro = typeof registro === "string" ? registro.trim() : "";

      if (!nome || !escolaridade || !profissao || !limitacoes) {
        return res.status(400).json({ erro: "Dados incompletos" });
      }

      if (
        nome.length > 100 ||
        profissao.length > 100 ||
        limitacoes.length > 300
      ) {
        return res.status(400).json({ erro: "Dados muito longos" });
      }

      const padraoSeguro = /^[a-zA-ZÀ-ÿ0-9\s.,\-_/()]+$/;

      if (
        !padraoSeguro.test(nome) ||
        !padraoSeguro.test(profissao)
      ) {
        return res.status(400).json({ erro: "Caracteres inválidos" });
      }

      const esc = escolaridade.toLowerCase();

      if ((esc.includes("tecnico") || esc.includes("superior")) && !registro) {
        return res.status(400).json({ erro: "Registro obrigatório" });
      }

      if (declaracao !== true) {
        return res.status(400).json({ erro: "Declaração obrigatória" });
      }

      // 🔒 HASH (controle)
      const nomeHash = hashSeguro(nome);

      // 🔒 CRIPTO (dados)
      const nomeCripto = CryptoJS.AES.encrypt(nome, SECRET).toString();
      const profCripto = CryptoJS.AES.encrypt(profissao, SECRET).toString();
      const limCripto = CryptoJS.AES.encrypt(limitacoes, SECRET).toString();
      const regCripto = registro
        ? CryptoJS.AES.encrypt(registro, SECRET).toString()
        : null;

      db.run(
        `INSERT INTO cadastros 
        (nome, nome_hash, escolaridade, profissao, limitacoes, registro, data)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nomeCripto,
          nomeHash,
          escolaridade,
          profCripto,
          limCripto,
          regCripto,
          new Date().toISOString()
        ],
        function (err) {

          if (err) {

            if (err.message.includes("UNIQUE")) {
              return res.status(409).json({
                erro: "Cadastro já existente"
              });
            }

            return next(err);
          }

          log("CADASTRO", {
            usuario: usuario.id,
            perfil: usuario.nivel
          });

          res.status(201).json({
            ok: true,
            mensagem: "Cadastro realizado com sucesso"
          });
        }
      );

    } catch (erro) {
      next(erro);
    }

  }
);

// ================= ERRO GLOBAL =================
app.use((err, req, res, next) => {

  if (err.message === "CORS_BLOCK") {
    return res.status(403).json({ erro: "Origem não permitida" });
  }

  log("ERRO_GLOBAL", {
    rota: req.url,
    erro: err.message
  });

  res.status(500).json({ erro: "Erro interno" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log("START", { porta: PORT });
});
