// ================= CADASTRO =================
app.post("/cadastro", async (req, res) => {
  try {
    const fs = require("fs");

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

    if (esc.includes("tecnico") || esc.includes("superior")) {
      if (!registro) {
        return res.status(400).json({ erro: "Registro profissional obrigatório (ART/TRT/RRT)" });
      }
    }

    if (declaracao !== true) {
      return res.status(400).json({ erro: "Declaração obrigatória não confirmada" });
    }

    // ================= BANCO =================
    let db = [];

    if (fs.existsSync("db.json")) {
      db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    }

    const novoCadastro = {
      nome,
      escolaridade,
      profissao,
      limitacoes,
      registro: registro || null,
      data: new Date().toISOString()
    };

    db.push(novoCadastro);

    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

    // ================= LOG =================
    let logs = [];

    if (fs.existsSync("log.json")) {
      logs = JSON.parse(fs.readFileSync("log.json", "utf-8"));
    }

    logs.push({
      evento: "Cadastro validado",
      usuario: nome,
      data: new Date().toISOString()
    });

    fs.writeFileSync("log.json", JSON.stringify(logs, null, 2));

    res.json({ ok: true, mensagem: "Cadastro realizado com sucesso" });

  } catch (erro) {
    console.error("Erro cadastro:", erro);
    res.status(500).json({ erro: "Erro interno no cadastro" });
  }
});
