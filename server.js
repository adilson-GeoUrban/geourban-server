const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// ================= 🔒 SEGURANÇA =================
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// ================= 📁 ARQUIVOS =================
app.use(express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
        res.set("Cache-Control", "no-store");
    }
}));

// ================= 🧾 LOGS =================
const LOG_PATH = path.join(__dirname, "logs.json");

function salvarLog(dado) {
    let logs = [];
    if (fs.existsSync(LOG_PATH)) {
        logs = JSON.parse(fs.readFileSync(LOG_PATH));
    }
    logs.push(dado);
    fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
}

// ================= 📡 API LOG =================
app.post('/api/log', (req, res) => {
    const log = {
        data: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        ...req.body
    };

    salvarLog(log);
    res.json({ status: "ok" });
});

// ================= 📄 API RELATÓRIO =================
app.get('/api/relatorio', (req, res) => {
    if (!fs.existsSync(LOG_PATH)) {
        return res.json([]);
    }
    const logs = JSON.parse(fs.readFileSync(LOG_PATH));
    res.json(logs);
});

// ================= 🧪 TESTE =================
app.get('/teste', (req, res) => {
    res.send("SERVIDOR OK");
});

// ================= 🌐 HOME =================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log("SERVIDOR RODANDO PORTA " + PORT);
});
