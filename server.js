const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// 🔐 CONFIG
const USER = "admin";
const PASS = "1234";
const SECRET = "geo_urban_chave_ultra_segura";

// 🛡️ CONTROLE
let logs = [];
let tentativas = {};
let inteligencia = {};

// 🧠 REGISTRO
function registrar(tipo, msg, ip){
    logs.push({
        tipo,
        msg,
        ip,
        data: new Date().toISOString()
    });
}

// 🚫 BLOQUEIO INTELIGENTE
function analisarIP(ip){
    if(!inteligencia[ip]){
        inteligencia[ip] = { risco: 0 };
    }
    return inteligencia[ip];
}

function bloqueado(ip){
    const intel = analisarIP(ip);
    return intel.risco >= 5;
}

// 🔐 TOKEN
function verificarToken(req, res, next){
    const token = req.headers["authorization"];

    if(!token){
        return res.status(403).json({ erro: "Sem token" });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({ erro: "Token inválido" });
        }
        req.user = decoded;
        next();
    });
}

// 🌐 HOME
app.get("/", (req, res) => {
    res.send("🛡️ BD2 NÍVEL 3 ATIVO");
});

// 🔐 LOGIN COM IA
app.post("/login", (req, res) => {
    const { user, pass } = req.body;
    const ip = req.ip;

    const intel = analisarIP(ip);

    if (bloqueado(ip)) {
        registrar("BLOQUEADO","Risco alto detectado", ip);
        return res.status(403).json({ erro: "Acesso bloqueado" });
    }

    if (user === USER && pass === PASS) {
        intel.risco = 0;

        const token = jwt.sign({ user }, SECRET, { expiresIn: "30m" });

        registrar("SUCESSO","Login OK", ip);

        return res.json({ token });
    } else {
        intel.risco += 1;

        registrar("ERRO","Login inválido | risco: " + intel.risco, ip);

        return res.status(401).json({ erro: true });
    }
});

// 📊 LOGS PROTEGIDO
app.get("/logs", verificarToken, (req, res) => {
    res.json(logs);
});

// 👁️ INTELIGÊNCIA VISUAL
app.get("/intel", verificarToken, (req, res) => {
    res.json(inteligencia);
});

// 🚀 START
app.listen(3000, () => {
    console.log("🛡️ BD2 NÍVEL 3 rodando em http://localhost:3000");
});
