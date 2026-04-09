const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 👑 CHAVE DO SOBERANO (MUDE ISSO)
const CHAVE_SOBERANO = "REI_123";

// 🔐 MIDDLEWARE DE PROTEÇÃO
function autenticar(req,res,next){
    const chave = req.headers["x-chave"];
    if(chave !== CHAVE_SOBERANO){
        return res.status(403).send("🚫 ACESSO NEGADO");
    }
    next();
}

// 📜 LOG
function log(msg){
    fs.appendFileSync("logs.txt", new Date().toLocaleString()+" - "+msg+"\n");
}

// 👑 ROTA PROTEGIDA (SALA SECRETA)
app.get("/sala-secreta", autenticar, (req,res)=>{
    log("Acesso autorizado ao Comando Central");
    res.send({
        status:"ACESSO LIBERADO",
        controlador:"SOBERANO",
        sistema:"GeoUrban ativo"
    });
});

// 🧠 IA EXECUTA SOMENTE COM AUTORIZAÇÃO
app.post("/executar", autenticar, (req,res)=>{
    const { ordem } = req.body;

    log("Ordem recebida: "+ordem);

    res.send({
        resposta:"👑 Ordem executada sob autorização do soberano",
        ordem: ordem
    });
});

app.listen(PORT,()=>console.log("👑 Sistema SOBERANO ativo"));
