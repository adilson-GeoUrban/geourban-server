const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "usuarios.json");

// garantir arquivo
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// salvar cadastro
app.post("/cadastro", (req, res) => {
    const dados = req.body;

    if (!dados.nome || !dados.cpf || !dados.telefone) {
        return res.status(400).json({ erro: "Dados incompletos" });
    }

    let banco = [];

    try {
        banco = JSON.parse(fs.readFileSync(DB_PATH));
    } catch (e) {
        return res.status(500).json({ erro: "Falha ao ler banco" });
    }

    // evitar duplicado
    const existe = banco.find(u => u.cpf === dados.cpf);
    if (existe) {
        return res.status(400).json({ erro: "Usuário já cadastrado" });
    }

    const novo = {
        id: Date.now(),
        nome: dados.nome,
        cpf: dados.cpf,
        telefone: dados.telefone,
        endereco: dados.endereco,
        perfil: dados.perfil,
        nivel: dados.nivel,
        documento: dados.documento || null,
        data: new Date()
    };

    banco.push(novo);

    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(banco, null, 2));
    } catch (e) {
        return res.status(500).json({ erro: "Falha ao salvar" });
    }

    res.json({ ok: true });
});
