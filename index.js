// ==============================
// GeoUrban - Bloco Único Blindado
// Substitui Bandeja 1 + Bandeja 2
// ==============================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Caminhos principais
const pastaBackup = path.join(__dirname, "backup");
const caminhoDados = path.join(__dirname, "dados.json");

// Cria pastas se não existirem
if (!fs.existsSync(pastaBackup)) fs.mkdirSync(pastaBackup);

/**
 * Função única: salva dados e cria backup blindado
 * @param {Object} novosDados - dados a salvar (usuarios, configuracoes)
 */
function salvarBlindado(novosDados) {
    try {
        // Lê dados existentes
        let dadosExistentes = {};
        if (fs.existsSync(caminhoDados)) {
            dadosExistentes = JSON.parse(fs.readFileSync(caminhoDados, "utf-8"));
        }

        // Auditoria e mescla usuários/designers
        if (novosDados.usuarios) {
            dadosExistentes.usuarios = dadosExistentes.usuarios || [];
            dadosExistentes.usuarios.push(...novosDados.usuarios);
        }

        // Auditoria e mescla configurações
        if (novosDados.configuracoes) {
            dadosExistentes.configuracoes = { ...(dadosExistentes.configuracoes || {}), ...novosDados.configuracoes };
        }

        // Salva no JSON
        fs.writeFileSync(caminhoDados, JSON.stringify(dadosExistentes, null, 2), "utf-8");
        console.log("💾 Dados salvos com sucesso!");

        // Cria backup .zip
        const arquivoZip = path.join(pastaBackup, `geourban_backup_${Date.now()}.zip`);
        const saida = fs.createWriteStream(arquivoZip);
        const zip = zlib.createGzip({ level: 9 });
        zip.pipe(saida);
        zip.write(fs.readFileSync(caminhoDados));
        zip.end();

        saida.on("close", () => console.log("✅ Backup finalizado:", arquivoZip));

    } catch (erro) {
        console.error("❌ Erro no salvamento blindado:", erro);
    }
}

// ==============================
// Exemplo de uso
// ==============================

const exemploDados = {
    usuarios: [
        { id: Date.now(), nome: "Designer Teste" },
        { id: Date.now() + 1, nome: "Designer GeoUrban" }
    ],
    configuracoes: { tema: "claro", versao: "1.0" }
};

// Salva e cria backup
salvarBlindado(exemploDados);

// Exporta função para usar no restante do servidor
module.exports = { salvarBlindado };
