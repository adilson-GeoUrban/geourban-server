const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const PptxGenJS = require("pptxgenjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const LOG = "logs.txt";
const BACKUP = "backup.json";
const HASH = "backup.hash";

// 🔹 LOG
function log(msg){
    const linha = new Date().toLocaleString()+" - "+msg+"\n";
    fs.appendFileSync(LOG, linha);
}

// 🔹 GERAR HASH (BLINDAGEM)
function gerarHash(dados){
    return crypto.createHash("sha256").update(dados).digest("hex");
}

// 🔹 BACKUP BLINDADO
function criarBackup(){
    const estado = {
        IAs: {
            Designer:"ATIVA",
            Material:"ATIVA",
            Monitoramento:"ATIVA",
            Relatorios:"ATIVA",
            Juridica:"ATIVA",
            Contabil:"ATIVA",
            Defesa:"ATIVA"
        },
        logs: fs.existsSync(LOG) ? fs.readFileSync(LOG,"utf8") : ""
    };

    const json = JSON.stringify(estado);
    const hash = gerarHash(json);

    fs.writeFileSync(BACKUP, json);
    fs.writeFileSync(HASH, hash);

    log("🛡️ Backup criado e blindado");
}

// 🔹 VERIFICA INTEGRIDADE
function verificarIntegridade(){
    if(!fs.existsSync(BACKUP) || !fs.existsSync(HASH)) return;

    const dados = fs.readFileSync(BACKUP,"utf8");
    const hashAtual = gerarHash(dados);
    const hashOriginal = fs.readFileSync(HASH,"utf8");

    if(hashAtual !== hashOriginal){
        log("🚨 ALERTA: Violação detectada! Backup corrompido!");
    } else {
        log("✅ Guardião: integridade confirmada");
    }
}

// 🔁 CICLO AUTÔNOMO
setInterval(()=>{
    log("🔄 Monitoramento ativo");
    verificarIntegridade();
    criarBackup();
},10000);

// 🔹 RELATÓRIO AUTOMÁTICO
function gerarRelatorio(){
    let pptx = new PptxGenJS();

    let slide = pptx.addSlide();
    slide.addText("Relatório GeoUrban", {x:1,y:1,fontSize:28});

    let logs = fs.existsSync(LOG)?fs.readFileSync(LOG,"utf8"):"Sem logs";

    let slide2 = pptx.addSlide();
    slide2.addText(logs.substring(0,1000),{x:1,y:1});

    pptx.writeFile("relatorio.pptx");
    log("📊 Relatório gerado");
}

setInterval(gerarRelatorio,30000);

// ROTAS
app.get("/logs",(req,res)=>{
    res.send("<pre>"+(fs.existsSync(LOG)?fs.readFileSync(LOG,"utf8"):"Sem logs")+"</pre>");
});

app.get("/backup",(req,res)=>{
    if(fs.existsSync(BACKUP)) res.download(BACKUP);
    else res.send("Sem backup");
});

app.get("/relatorio",(req,res)=>{
    if(fs.existsSync("relatorio.pptx")) res.download("relatorio.pptx");
    else res.send("Sem relatório");
});

app.listen(PORT,()=>console.log("👑 GeoUrban com Guardião Blindado ATIVO"));
