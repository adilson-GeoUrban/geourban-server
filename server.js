const bcrypt = require("bcrypt");

app.post("/cadastro", async (req, res) => {
    const dados = req.body;

    // validação básica
    if (!dados.nome || !dados.cpf || !dados.telefone) {
        return res.status(400).json({ erro: "Dados incompletos" });
    }

    let banco = [];

    // carregar banco
    try {
        banco = JSON.parse(fs.readFileSync(DB_PATH));
    } catch (e) {
        return res.status(500).json({ erro: "Falha ao ler banco" });
    }

    // 🔐 VERIFICAR CPF DUPLICADO (AGORA CORRETO)
    for (let u of banco) {
        const igual = await bcrypt.compare(dados.cpf, u.cpf);
        if (igual) {
            return res.status(400).json({ erro: "CPF já cadastrado" });
        }
    }

    // 🔐 CRIPTOGRAFAR CPF
    let cpfHash;
    try {
        cpfHash = await bcrypt.hash(dados.cpf, 10);
    } catch (e) {
        return res.status(500).json({ erro: "Erro ao proteger CPF" });
    }

    // criar usuário
    const novo = {
        id: Date.now(),
        nome: dados.nome,
        cpf: cpfHash,
        telefone: dados.telefone,
        endereco: dados.endereco,
        perfil: dados.perfil,
        nivel: dados.nivel,
        documento: dados.documento || null,
        data: new Date()
    };

    banco.push(novo);

    // salvar banco
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(banco, null, 2));
    } catch (e) {
        return res.status(500).json({ erro: "Falha ao salvar" });
    }

    res.json({ ok: true });
});
