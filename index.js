const express = require("express");
const app = express();
// =======================================
// 🟢 BLOCO UNIFICADO FINAL - GEO URBAN
// Bandeja 1 + Bandeja 2 + Backup + Rotas
// =======================================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ================================
// Caminhos principais
// ================================
const pastaBackup = path.join(__dirname, "backup");
const arquivoB1 = path.join(__dirname, "dados.json");
const arquivoB2 = path.join(__dirname, "dados_bandeja2.json");

// Criar pasta backup se não existir
if (!fs.existsSync(pastaBackup)) {
    fs.mkdirSync(pastaBackup);
}

// ================================
// Função de BACKUP
// ================================
function criarBackup(arquivo, ambiente) {
    try {
        const nome = `backup_env${ambiente}_${Date.now()}.json.gz`;
        const destino = path.join(pastaBackup, nome);

        const gzip = zlib.createGzip();
        const origem = fs.createReadStream(arquivo);
        const saida = fs.createWriteStream(destino);

        origem.pipe(gzip).pipe(saida);

        console.log(`✅ Backup criado (${ambiente}): ${nome}`);
    } catch (erro) {
        console.log("❌ Erro no backup:", erro.message);
    }
}

// ================================
// SALVAR DADOS (UNIFICADO)
// ================================
function salvarTudo(dados, ambiente = 1) {
    try {
        const arquivo = ambiente === 2 ? arquivoB2 : arquivoB1;

        let atual = {};

        if (fs.existsSync(arquivo)) {
            atual = JSON.parse(fs.readFileSync(arquivo, "utf-8"));
        }

        const final = {
            ...atual,
            ...dados,
            atualizadoEm: new Date().toISOString()
        };

        fs.writeFileSync(arquivo, JSON.stringify(final, null, 2));

        criarBackup(arquivo, ambiente);

        console.log(`✅ Dados salvos (Bandeja ${ambiente})`);

    } catch (erro) {
        console.log("❌ Erro ao salvar:", erro.message);
    }
}

// ================================
// ROTA SALVAR TUDO
// ================================
app.post("/salvar-tudo", express.json(), (req, res) => {
    const dados = req.body;
    const ambiente = req.body.env === 2 ? 2 : 1;

    salvarTudo(dados, ambiente);

    res.json({
        status: "ok",
        ambiente,
        mensagem: "Salvo + backup criado"
    });
});

// ================================
// ROTA STATUS
// ================================
app.get("/status", (req, res) => {
    res.json({
        sistema: "GeoUrban",
        status: "online",
        bandejas: ["1 ativa", "2 ativa"],
        backup: "ok",
        hora: new Date()
    });
});

// ================================
// LOG INICIAL
// ================================
const express = require("express");
const app = express();

// outras funções...

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
console.log("🚀 BLOCO UNIFICADO ATIVO - GEOURBAN");
app.listen(3000, () => {
    console.log("Servidor rodando");
});
