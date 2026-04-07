// ==============================
// GeoUrban Server - index.js (Blocos Unificados)
// ==============================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const express = require("express");

// ==============================
// 🟦 BANDEJA 1: Configuração de caminhos
// ==============================

const pastaBackup = path.join(__dirname, "backup");
const caminhoDados = path.join(__dirname, "dados.json"); // arquivo principal de dados
const publicPath = path.join(__dirname, "public");

// Cria pasta de backup se não existir
if (!fs.existsSync(pastaBackup)) fs.mkdirSync(pastaBackup);

// Cria pasta public se não existir
if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath);

// ==============================
// 🟩 BANDEJA 2: Funções de salvamento e backup
// ==============================

function salvarDados(dados) {
    try {
        fs.writeFileSync(caminhoDados, JSON.stringify(dados, null, 2), "utf-8");
        console.log("💾 Dados salvos com sucesso!");
        criarBackup();
    } catch (erro) {
        console.error("❌ Erro ao salvar dados:", erro);
    }
}

function criarBackup() {
    const arquivoBackupPath = path.join(pastaBackup, `geourban_backup_${Date.now()}.zip`);
    const saida = fs.createWriteStream(arquivoBackupPath);
    const zip = zlib.createGzip({ level: 9 });

    zip.pipe(saida);

    zip.on("error", (err) => console.error("❌ Erro no backup:", err));
    saida.on("close", () => console.log("✅ Backup finalizado:", arquivoBackupPath));

    // Adiciona arquivo de dados ao zip
    if (fs.existsSync(caminhoDados)) {
        const dados = fs.readFileSync(caminhoDados);
        zip.write(dados);
    }

    zip.end();
}

// ==============================
// 🟨 BANDEJA 3: Monitoramento de pasta
// ==============================

function monitorarPasta() {
    fs.watch(pastaBackup, (evento, arquivo) => {
        if (arquivo) console.log(`📂 Evento: ${evento} no arquivo: ${arquivo}`);
    });
}

// ==============================
// 🟧 BANDEJA 4: Servidor Express
// ==============================

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicPath));

// Endpoint de status
app.get("/status", (req, res) => {
    res.send({ status: "GeoUrban rodando normal ✅" });
});

// Endpoint para salvar dados via POST
app.post("/salvar", (req, res) => {
    salvarDados(req.body);
    res.send({ status: "Dados salvos ✅" });
});

// ==============================
// 🟪 BANDEJA 5: Inicialização
// ==============================

app.listen(PORT, () => {
    console.log(`🌐 GeoUrban Server rodando em http://localhost:${PORT}`);
    monitorarPasta();

    // Exemplo de dados inicial
    const exemploDados = {
        usuarios: [
            { id: 1, nome: "Adilson" },
            { id: 2, nome: "GeoUrban" }
        ],
        configuracoes: { tema: "claro", versao: "1.0" }
    };

    salvarDados(exemploDados);
});
