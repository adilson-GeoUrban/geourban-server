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
    return t.count >= 3 && (Date.now() - t.time) < 300000;
}

// 🔐 MIDDLEWARE TOKEN
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
    res.send("🛡️ BD2 NÍVEL 2 ATIVO");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { user, pass } = req.body;
    const ip = req.ip;

    if (bloqueado(ip)) {
        registrar("BLOQUEADO","IP bloqueado", ip);
        return res.status(403).json({ erro: "Bloqueado" });
    }

    if (user === USER && pass === PASS) {
        tentativas[ip] = { count: 0, time: Date.now() };

        const token = jwt.sign({ user }, SECRET, { expiresIn: "30m" });

        registrar("SUCESSO","Login OK", ip);

        return res.json({ token });
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
app.get("/logs", verificarToken, (req, res) => {
    res.json(logs);
});

// 🚀 START
app.listen(3000, () => {
    console.log("🛡️ BD2 NÍVEL 2 rodando em http://localhost:3000");
});
