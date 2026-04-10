const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DB = "db.json";
const LOG = "log.json";

// cria arquivos se não existirem
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify([]));
if (!fs.existsSync(LOG)) fs.writeFileSync(LOG, JSON.stringify([]));

// 🔐 AUDITORIA
function logEvento(evento) {
    const logs = JSON.parse(fs.readFileSync(LOG));
    logs.push({ evento, data: new Date() });
    fs.writeFileSync(LOG, JSON.stringify(logs, null, 2));
}

// 📥 CADASTRO
app.post("/cadastro", (req, res) => {
    const { usuario, senha } = req.body;

    const db = JSON.parse(fs.readFileSync(DB));

    if (db.find(u => u.usuario === usuario)) {
        return res.json({ erro: "Usuário já existe" });
    }

    db.push({ usuario, senha });
    fs.writeFileSync(DB, JSON.stringify(db, null, 2));

    logEvento("Novo cadastro: " + usuario);

    res.json({ ok: true });
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    const db = JSON.parse(fs.readFileSync(DB));

    const user = db.find(u => u.usuario === usuario && u.senha === senha);

    if (!user) {
        logEvento("Tentativa de login falhou: " + usuario);
        return res.json({ erro: "Login inválido" });
    }

    logEvento("Login realizado: " + usuario);

    res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor rodando"));
