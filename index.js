// ================= SQLITE + CADASTRO =================
const sqlite3 = require("sqlite3").verbose();

// cria banco
const db = new sqlite3.Database("./banco.db");

// cria tabela
db.serialize(() => {
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

    // 🔴 VALIDAÇÃO
    if (!nome || !escolaridade || !profissao || !limitacoes) {
      return res.status(400).json({ erro: "Dados obrigatórios incompletos" });
    }

    const esc = escolaridade.toLowerCase();

    if (esc.includes("técnico") || esc.includes("superior")) {
      if (!registro) {
        return res.status(400).json({ erro: "Registro profissional obrigatório" });
      }
    }

    if (declaracao !== true) {
      return res.status(400).json({ erro: "Declaração obrigatória não confirmada" });
    }

    // 💾 SALVAR
    db.run(
      `INSERT INTO cadastros 
      (nome, escolaridade, profissao, limitacoes, registro, data)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro || null,
        new Date().toISOString()
      ],
      function(err) {
        if (err) {
          console.error("Erro banco:", err);
          return next(err);
        }

        res.json({ ok: true });
      }
    );

  } catch (erro) {
    next(erro);
  }
});

// ================= LISTAR =================
app.get("/cadastros", (req, res) => {
  db.all("SELECT * FROM cadastros ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }
    res.json(rows);
  });
});
