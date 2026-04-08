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

// 🧠 INTELIGÊNCIA
function analisarIP(ip){
    if(!inteligencia[ip]){
        inteligencia[ip] = {
            risco: 0,
            bloqueadoAte: 0,
            permanente: false
        };
    }
    return inteligencia[ip];
}

// 🚫 BLOQUEIO DINÂMICO
function verificarBloqueio(ip){
    const intel = analisarIP(ip);

    if (intel.permanente) return true;

    if (Date.now() < intel.bloqueadoAte) return true;

    return false;
}

// 🔥 RESPOSTA AUTOMÁTICA
function reagirAtaque(ip){
    const intel = analisarIP(ip);

    intel.risco += 1;

    if (intel.risco >= 20){
        intel.permanente = true;
        registrar("CRÍTICO","IP banido permanente", ip);
    }
    else if (intel.risco >= 10){
        intel.bloqueadoAte = Date.now() + (60 * 60 * 1000); // 1h
        registrar("ALTO","Bloqueio 1h", ip);
    }
    else if (intel.risco >= 5){
        intel.bloqueadoAte = Date.now() + (5 * 60 * 1000); // 5 min
        registrar("MÉDIO","Bloqueio 5min", ip);
    }
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
    res.send("🛡️ EXÉRCITO DIGITAL ATIVO");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { user, pass } = req.body;
    const ip = req.ip;

    if (verificarBloqueio(ip)) {
        registrar("BLOQUEADO","Acesso negado", ip);
        return res.status(403).json({ erro: "Bloqueado" });
    }

    if (user === USER && pass === PASS) {
        const token = jwt.sign({ user }, SECRET, { expiresIn: "30m" });

        const intel = analisarIP(ip);
        intel.risco = 0;

        registrar("SUCESSO","Login OK", ip);

        return res.json({ token });
    } else {
        reagirAtaque(ip);
        registrar("ERRO","Login inválido", ip);

        return res.status(401).json({ erro: true });
    }
});

// 📊 LOGS
app.get("/logs", verificarToken, (req, res) => {
    res.json(logs);
});

// 👁️ INTEL
app.get("/intel", verificarToken, (req, res) => {
    res.json(inteligencia);
});

// 🚀 START
app.listen(3000, () => {
    console.log("🛡️ EXÉRCITO DIGITAL rodando em http://localhost:3000");
});
