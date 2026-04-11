const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= 🔒 CONFIG =================
const JWT_SECRET = process.env.JWT_SECRET || "trocar_urgente_super_secreto";
const USERS_PATH = path.join(__dirname, "users.json");
const LOG_PATH = path.join(__dirname, "logs.json");

// ================= 🔐 HELPERS =================
function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

function gerarToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const assinatura = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(header + "." + body)
        .digest('base64url');
    return `${header}.${body}.${assinatura}`;
}

function verificarToken(token) {
    try {
        const [header, body, assinatura] = token.split('.');
        const valid = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(header + "." + body)
            .digest('base64url');

        if (assinatura !== valid) return null;

        return JSON.parse(Buffer.from(body, 'base64url').toString());
    } catch {
        return null;
    }
}

function salvarJSON(caminho, dados) {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function lerJSON(caminho) {
    if (!fs.existsSync(caminho)) return [];
    return JSON.parse(fs.readFileSync(caminho));
}

// ================= 📦 MIDDLEWARE =================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= 👤 REGISTRO =================
app.post('/api/register', (req, res) => {
    const { user, pass } = req.body;

    let users = lerJSON(USERS_PATH);

    if (users.find(u => u.user === user)) {
        return res.status(400).json({ erro: "Usuário já existe" });
    }

    users.push({
        user,
        pass: hashSenha(pass)
    });

    salvarJSON(USERS_PATH, users);

    res.json({ status: "ok" });
});

// ================= 🔑 LOGIN =================
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    let users = lerJSON(USERS_PATH);

    const encontrado = users.find(u => u.user === user && u.pass === hashSenha(pass));

    if (!encontrado) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = gerarToken({ user, time: Date.now() });

    res.json({ token });
});

// ================= 🔐 PROTEÇÃO =================
function auth(req, res, next) {
    const token = req.headers.authorization;

    const dados = verificarToken(token);
    if (!dados) return res.status(401).json({ erro: "Não autorizado" });

    req.user = dados;
    next();
}

// ================= 🧾 LOG =================
app.post('/api/log', (req, res) => {
    let logs = lerJSON(LOG_PATH);

    logs.push({
        data: new Date().toISOString(),
        ip: req.socket.remoteAddress,
        ...req.body
    });

    salvarJSON(LOG_PATH, logs);

    res.json({ ok: true });
});

// ================= 📄 RELATÓRIO PROTEGIDO =================
app.get('/api/relatorio', auth, (req, res) => {
    const logs = lerJSON(LOG_PATH);
    res.json(logs);
});

// ================= 🌐 ROTAS =================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log("Servidor empresarial ativo porta " + PORT);
});
