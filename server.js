app.post("/cadastro", (req, res) => {
    const fs = require("fs");

    const {
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro,
        declaracao
    } = req.body;

    // 🔴 VALIDAÇÃO OBRIGATÓRIA
    if (!nome || !escolaridade || !profissao || !limitacoes) {
        return res.status(400).json({ erro: "Dados obrigatórios incompletos" });
    }

    // 🔴 REGRA PROFISSIONAL
    const esc = escolaridade.toLowerCase();

    if (esc.includes("tecnico") || esc.includes("superior")) {
        if (!registro) {
            return res.status(400).json({ erro: "Registro profissional obrigatório (ART/TRT/RRT)" });
        }
    }

    // 🔴 DECLARAÇÃO OBRIGATÓRIA
    if (declaracao !== true) {
        return res.status(400).json({ erro: "Declaração obrigatória não confirmada" });
    }

    // 📂 BANCO
    let db = [];
    if (fs.existsSync("db.json")) {
        db = JSON.parse(fs.readFileSync("db.json"));
    }

    db.push({
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro: registro || null,
        data: new Date()
    });

    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

    // 📊 AUDITORIA
    let logs = [];
    if (fs.existsSync("log.json")) {
        logs = JSON.parse(fs.readFileSync("log.json"));
    }

    logs.push({
        evento: "Cadastro validado e aprovado",
        usuario: nome,
        data: new Date()
    });

    fs.writeFileSync("log.json", JSON.stringify(logs, null, 2));

    res.json({ ok: true });
});
