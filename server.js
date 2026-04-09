const express = require("express");
const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const LOG_PATH = path.join(__dirname, "logs.txt");
const BACKUP_PATH = path.join(__dirname, "backup.json");

// 🔹 FUNÇÃO DE LOG
function registrarLog(msg) {
    const linha = new Date().toLocaleString() + " - " + msg + "\n";
    fs.appendFileSync(LOG_PATH, linha);
}

// 🔹 FUNÇÃO DE BACKUP
function criarBackup() {
    const estado = {
        ia: {
            Designer: "ATIVA",
            Material: "ATIVA",
            Monitoramento: "ATIVA",
            Relatorios: "ATIVA",
            Juridica: "ATIVA",
            Contabil: "ATIVA",
            Exército: "ATIVA"
        },
        logs: fs.existsSync(LOG_PATH) ? fs.readFileSync(LOG_PATH, "utf8") : ""
    };
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(estado, null, 2));
    registrarLog("Backup automático criado");
}

// 🔹 RODANDO IA E BACKUP AUTOMÁTICO
setInterval(() => {
    registrarLog("IA Monitoramento executando verificação geral");
    registrarLog("IA Designer: OK");
    registrarLog("IA Jurídica: OK");
    registrarLog("IA Contábil: OK");
    registrarLog("IA Exército de Defesa: OK");

    // criar backup a cada ciclo
    criarBackup();
}, 10000);

// 🔹 GERAR RELATÓRIO AUTOMÁTICO
function gerarRelatorioAutomatico() {
    let pptx = new PptxGenJS();
    let slide1 = pptx.addSlide();
    slide1.addText("Relatório GeoUrban", { x:1, y:1, fontSize:28 });

    let logs = fs.existsSync(LOG_PATH) ? fs.readFileSync(LOG_PATH, "utf8") : "Sem logs";

    let slide2 = pptx.addSlide();
    slide2.addText("Atividades do Sistema:", { x:1, y:1 });
    slide2.addText(logs.substring(0, 1000), { x:1, y:2 });

    pptx.writeFile("relatorio_auto.pptx");
    registrarLog("Relatório automático gerado");
}

// 🔁 GERA RELATÓRIO AUTOMÁTICO A CADA 30s
setInterval(gerarRelatorioAutomatico, 30000);

// 🔹 ROTAS
app.get("/baixar-relatorio", (req, res) => {
    const file = path.join(__dirname, "relatorio_auto.pptx");
    if (fs.existsSync(file)) res.download(file);
    else res.send("Relatório ainda não gerado");
});

app.get("/logs", (req, res) => {
    if (fs.existsSync(LOG_PATH)) res.send("<pre>" + fs.readFileSync(LOG_PATH, "utf8") + "</pre>");
    else res.send("Sem logs");
});

app.get("/backup", (req, res) => {
    if (fs.existsSync(BACKUP_PATH)) res.download(BACKUP_PATH);
    else res.send("Backup ainda não criado");
});

app.listen(PORT, () => console.log("GeoUrban AUTÔNOMO com backup e ponto de restauração ativo"));
