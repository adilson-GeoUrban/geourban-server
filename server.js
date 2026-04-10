const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "banco.json");

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// garantir banco
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]");
}

// =============================
// 📌 ROTA PRINCIPAL (FRONT)
// =============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =============================
// 🔐 CADASTRO
// =============================
app.post("/cadastro", async (req, res) => {
    try {
        const { cpf } = req.body;

        if (!cpf) {
            return res.status(400).json({ erro: "CPF obrigatório" });
        }

        let banco = JSON.parse(fs.readFileSync(DB_PATH));

        // verificar duplicado (hash)
        for (let u of banco) {
            const igual = await bcrypt.compare(cpf, u.cpf);
            if (igual) {
                return res.status(400).json({ erro: "CPF já cadastrado" });
            }
        }

        const hash = await bcrypt.hash(cpf, 10);

        banco.push({
            id: Date.now(),
            cpf: hash
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(banco, null, 2));

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
        const { cpf } = req.body;

        if (!cpf) {
            return res.status(400).json({ erro: "CPF obrigatório" });
        }

        let banco = JSON.parse(fs.readFileSync(DB_PATH));

        for (let u of banco) {
            const igual = await bcrypt.compare(cpf, u.cpf);
            if (igual) {
                return res.json({ ok: true });
            }
        }

        res.status(401).json({ ok: false });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no login" });
    }
});

// =============================
// 🚀 START
// =============================
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
