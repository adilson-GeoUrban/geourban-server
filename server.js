const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const usuarios = [];

// 🔐 CADASTRO
app.post("/cadastro", async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ erro: "Dados obrigatórios" });
    }

    const cpfHash = await bcrypt.hash(cpf, 10);

    const existe = usuarios.find(u => u.cpf === cpfHash);
    if (existe) {
        return res.status(400).json({ erro: "CPF já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    usuarios.push({
        cpf: cpfHash,
        senha: senhaHash
    });

    res.json({ ok: true });
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    for (let user of usuarios) {
        const cpfOk = await bcrypt.compare(cpf, user.cpf);
        const senhaOk = await bcrypt.compare(senha, user.senha);

        if (cpfOk && senhaOk) {
            return res.json({ ok: true });
        }
    }

    res.status(401).json({ erro: "Credenciais inválidas" });
});

// 🔐 CERTIFICADO (SEGURO)
const CHAVE_MASTER = process.env.CHAVE_MASTER;

app.post("/login-cert", (req, res) => {
    const { chave } = req.body;

    if (chave === CHAVE_MASTER) {
        return res.json({ ok: true, tipo: "certificado_simulado" });
    }

    res.status(401).json({ ok: false });
});

// 🌐 ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
