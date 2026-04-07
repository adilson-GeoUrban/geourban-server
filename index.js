// ==============================
// GeoUrban Server - index.js
// ==============================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ==============================
// 🟦 BANDEJA 1: Configuração de caminhos
// ==============================

const pastaBackup = path.join(__dirname, "backup");
const arquivoBackupPath = path.join(__dirname, "geourban_backup.zip");

// Cria pasta de backup se não existir
if (!fs.existsSync(pastaBackup)) {
    fs.mkdirSync(pastaBackup);
}

// ==============================
// 🟩 BANDEJA 2: Função de backup em zip
// ==============================

function criarBackup() {
    const saida = fs.createWriteStream(arquivoBackupPath);
    const zip = zlib.createGzip({ level: 9 });

    saida.on("close", () => {
        console.log("✅ Backup finalizado:", arquivoBackupPath);
    });

    zip.on("error", (err) => {
        console.error("❌ Erro no zip:", err);
    });

    // Exemplo de adicionar todos arquivos da pastaBackup ao zip
    fs.readdir(pastaBackup, (err, arquivos) => {
        if (err) return console.error("Erro lendo pasta backup:", err);

        arquivos.forEach((arquivo) => {
            const caminhoCompleto = path.join(pastaBackup, arquivo);
            const dados = fs.readFileSync(caminhoCompleto);
            zip.write(dados);
        });

        zip.end(); // Finaliza o zip
        zip.pipe(saida);
    });
}

// ==============================
// 🟨 BANDEJA 3: Monitoramento e logs
// ==============================

function monitorarPasta() {
    fs.watch(pastaBackup, (evento, arquivo) => {
        if (arquivo) {
            console.log(`📂 Evento: ${evento} no arquivo: ${arquivo}`);
        }
    });
}

// ==============================
// 🟧 BANDEJA 4: Inicialização do servidor
// ==============================

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (front-end)
app.use(express.static(path.join(__dirname, "public")));

app.get("/status", (req, res) => {
    res.send({ status: "GeoUrban rodando normal ✅" });
});

app.listen(PORT, () => {
    console.log(`🌐 GeoUrban Server rodando em http://localhost:${PORT}`);
    monitorarPasta();
    criarBackup();
});
