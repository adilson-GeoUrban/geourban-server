const express = require("express");
const app = express();

app.use(express.json());

// 🔐 CONFIG
const USER = "admin";
const PASS = "1234";

// 🛡️ CONTROLE
let logs = [];
let tentativas = {};

// 🧠 REGISTRO
function registrar(tipo, msg, ip){
    logs.push({
        tipo,
        msg,
        ip,
        data: new Date().toISOString()
    });
}

// 🚫 BLOQUEIO
function bloqueado(ip){
    if(!tentativas[ip]) return false;
    const t = tentativas[ip];
    return t.count >= 3 && (Date.now() - t.time) < 300000; // 5 min
}

// 🌐 HOME
app.get("/", (req, res) => {
    res.send("🛡️ BD2 BLINDADO ATIVO");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { user, pass } = req.body;
    const ip = req.ip;

    if (bloqueado(ip)) {
        registrar("BLOQUEADO","IP bloqueado", ip);
        return res.status(403).json({ erro: "Bloqueado temporariamente" });
    }

    if (user === USER && pass === PASS) {
        tentativas[ip] = { count: 0, time: Date.now() };
        registrar("SUCESSO","Login OK", ip);
        return res.json({ ok: true });
    } else {
        tentativas[ip] = {
            count: (tentativas[ip]?.count || 0) + 1,
            time: Date.now()
        };
        registrar("ERRO","Login inválido", ip);
        return res.status(401).json({ erro: true });
    }
});

// 📊 LOGS PROTEGIDO
app.get("/logs", (req, res) => {
    res.json(logs);
});

// 🚀 START
app.listen(3000, () => {
    console.log("🛡️ BD2 BLINDADO rodando em http://localhost:3000");
});
