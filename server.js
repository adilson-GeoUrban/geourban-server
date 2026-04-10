const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "banco.json");

// =============================
// 🔧 MIDDLEWARE
// =============================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =============================
// 🗄️ GARANTIR BANCO
// =============================
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]");
}

function lerBanco() {
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function salvarBanco(dados) {
    fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2));
}

// =============================
// 🔐 CADASTRO
// =============================
app.post("/cadastro", async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({ erro: "Dados obrigatórios" });
        }

        let banco = lerBanco();

        // 🔍 impedir duplicidade REAL
        for (let u of banco) {
            const igual = await bcrypt.compare(cpf, u.cpf);
            if (igual) {
                return res.status(400).json({ erro: "CPF já cadastrado" });
            }
        }

        const cpfHash = await bcrypt.hash(cpf, 10);
        const senhaHash = await bcrypt.hash(senha, 10);

        banco.push({
            id: Date.now(),
            cpf: cpfHash,
            senha: senhaHash,
            criadoEm: new Date()
        });

        salvarBanco(banco);

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no cadastro" });
    }
});

// =============================
// 🔐 LOGIN
// =============================
app.post("/login", async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        let banco = lerBanco();

        for (let u of banco) {
            const cpfOk = await bcrypt.compare(cpf, u.cpf);
            const senhaOk = await bcrypt.compare(senha, u.senha);

            if (cpfOk && senhaOk) {
                // 🔐 gerar token simples
                const token = crypto.randomBytes(16).toString("hex");

                return res.json({
                    ok: true,
                    token
                });
            }
        }

        res.status(401).json({ erro: "Credenciais inválidas" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no login" });
    }
});

// =============================
// 🌐 ROTA PRINCIPAL
// =============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =============================
// 🚀 START
// =============================
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
