const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 3000;

// 🔐 Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 📁 Banco simples
const DB_PATH = path.join(__dirname, "usuarios.json");

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// 🚪 ROTA PRINCIPAL (FORÇA LOGIN)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔐 CADASTRO SEGURO
app.post("/cadastro", async (req, res) => {
    const dados = req.body;

    if (!dados.nome || !dados.cpf || !dados.telefone) {
        return res.status(400).json({ erro: "Dados incompletos" });
    }

    let banco = [];

    try {
        banco = JSON.parse(fs.readFileSync(DB_PATH));
    } catch (e) {
        return res.status(500).json({ erro: "Erro ao ler banco" });
    }

    // 🚫 impedir CPF duplicado (mesmo criptografado)
    for (let u of banco) {
        const igual = await bcrypt.compare(dados.cpf, u.cpf);
        if (igual) {
            return res.status(400).json({ erro: "CPF já cadastrado" });
        }
    }

    // 🔐 criptografia
    const cpfHash = await bcrypt.hash(dados.cpf, 10);

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

    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(banco, null, 2));
    } catch (e) {
        return res.status(500).json({ erro: "Erro ao salvar" });
    }

    res.json({ ok: true });
});

// 🔐 LOGIN SIMPLES
app.post("/login", async (req, res) => {
    const { cpf } = req.body;

    let banco = JSON.parse(fs.readFileSync(DB_PATH));

    for (let u of banco) {
        const igual = await bcrypt.compare(cpf, u.cpf);
        if (igual) {
            return res.json({ ok: true });
        }
    }

    res.status(401).json({ erro: "Usuário não encontrado" });
});

// 🚀 START
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
