const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= SEGURANÇA =================
const JWT_SECRET = process.env.JWT_SECRET || "trocar_urgente";

// ================= MEMÓRIA (SAFE PARA RENDER FREE) =================
let users = [];
let logs = [];

// ================= HELPERS =================
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

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= TESTE =================
app.get('/teste', (req, res) => {
    res.send("SERVIDOR OK");
});

// ================= REGISTRO =================
app.post('/api/register', (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        return res.status(400).json({ erro: "Dados obrigatórios" });
    }

    if (users.find(u => u.user === user)) {
        return res.status(400).json({ erro: "Usuário já existe" });
    }

    users.push({
        user,
        pass: hashSenha(pass)
    });

    res.json({ status: "ok" });
});

// ================= LOGIN =================
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    const encontrado = users.find(
        u => u.user === user && u.pass === hashSenha(pass)
    );

    if (!encontrado) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = gerarToken({ user, time: Date.now() });

    res.json({ token });
});

// ================= AUTH =================
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ erro: "Token ausente" });
    }

    const dados = verificarToken(token);

    if (!dados) {
        return res.status(401).json({ erro: "Token inválido" });
    }

    req.user = dados;
    next();
}

// ================= LOG =================
app.post('/api/log', (req, res) => {
    logs.push({
        data: new Date().toISOString(),
        ip: req.socket.remoteAddress,
        ...req.body
    });

    res.json({ ok: true });
});

// ================= RELATÓRIO =================
app.get('/api/relatorio', auth, (req, res) => {
    res.json(logs);
});

// ================= FRONT =================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================= START =================
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
