const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 👑 CHAVE SOBERANO
const CHAVE_SOBERANO = "A9x#72!GeoUrban@Rei2026";

// 🔐 SESSÕES
const SESSOES = {};

// 📜 LOG
function log(msg){
    fs.appendFileSync("logs.txt", new Date().toLocaleString()+" - "+msg+"\n");
}

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { tipo, chave } = req.body;

    // LOGIN PADRÃO
    if(tipo === "padrao"){
        const token = Math.random().toString(36).substring(2);
        SESSOES[token] = { nivel: "usuario" };

        log("Login padrão realizado");
        return res.send({ token, nivel:"usuario" });
    }

    // LOGIN SOBERANO
    if(tipo === "soberano" && chave === CHAVE_SOBERANO){
        const token = Math.random().toString(36).substring(2);
        SESSOES[token] = { nivel: "soberano" };

        log("👑 Login soberano autorizado");
        return res.send({ token, nivel:"soberano" });
    }

    return res.status(403).send("🚫 Acesso negado");
});

// 🔐 MIDDLEWARE
function autenticar(nivel){
    return (req,res,next)=>{
        const token = req.headers["x-token"];
        const sessao = SESSOES[token];

        if(!sessao){
            return res.status(403).send("🚫 Não autenticado");
        }

        if(nivel === "soberano" && sessao.nivel !== "soberano"){
            return res.status(403).send("🚫 Acesso restrito");
        }

        next();
    }
}

// 👑 EXECUTAR ORDEM
app.post("/executar", autenticar("usuario"), (req,res)=>{
    const { ordem } = req.body;
    log("Ordem: "+ordem);
    res.send("✔ Ordem executada: "+ordem);
});

// 👑 SALA SECRETA
app.get("/sala-secreta", autenticar("soberano"), (req,res)=>{
    res.send("👑 Bem-vindo ao controle total");
});

// 📜 LOGS
app.get("/logs", autenticar("soberano"), (req,res)=>{
    res.send("<pre>"+(fs.existsSync("logs.txt")?fs.readFileSync("logs.txt","utf8"):"")+"</pre>");
});

// 💾 BACKUP SIMPLES
app.get("/backup", autenticar("soberano"), (req,res)=>{
    res.download("backup.json");
});

app.listen(PORT, ()=>console.log("👑 GeoUrban rodando com login unificado"));
