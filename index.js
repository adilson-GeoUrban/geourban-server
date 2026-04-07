{
  "usuarios": ["adilson"]
}
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ================================
// 🟢 Caminhos principais
// ================================
const pastaBackup = path.join(__dirname, "backup");
const arquivoDadosB1 = path.join(__dirname, "dados.json");
const arquivoDadosB2 = path.join(__dirname, "dados_bandeja2.json");

// Criar pasta backup se não existir
if (!fs.existsSync(pastaBackup)) fs.mkdirSync(pastaBackup);

// ================================
// 🟢 Função unificada salvar-tudo
// ================================
function salvarTudo(dados, env = 1) {
    try {
        // Escolhe arquivo certo
        const arquivo = env === 2 ? arquivoDadosB2 : arquivoDadosB1;

        // Lê dados existentes
        let dadosExistentes = {};
        if (fs.existsSync(arquivo)) {
            dadosExistentes = JSON.parse(fs.readFileSync(arquivo, "utf-8"));
        }

        // Mescla dados
        const dadosFinais = { ...dadosExistentes, ...dados, atualizadoEm: new Date().toISOString() };

        // Salva JSON
        fs.writeFileSync(arquivo, JSON.stringify(dadosFinais, null, 2), "utf-8");

        // Cria backup compactado
        const nomeBackup = `backup_env${env}_${Date.now()}.json.gz`;
        const caminhoBackup = path.join(pastaBackup, nomeBackup);
        const gzip = zlib.createGzip();
        const stream = fs.createReadStream(arquivo);
        const destino = fs.createWriteStream(caminhoBackup);
        stream.pipe(gzip).pipe(destino);

        console.log(`✅ Ambiente ${env} salvo com backup: ${nomeBackup}`);
    } catch (erro) {
        console.error(`❌ Erro ao salvar ambiente ${env}:`, erro.message);
    }
}

// ================================
// 🌐 Rota /salvar-tudo
// ================================
app.post("/salvar-tudo", express.json(), (req, res) => {
    const dados = req.body;
    const env = req.body.env === 2 ? 2 : 1;

    salvarTudo(dados, env);

    res.json({
        status: "ok",
        ambiente: env,
        mensagem: "Dados salvos e backup gerado!"
    });
});
