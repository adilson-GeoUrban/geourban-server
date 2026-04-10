// =============================
// 💾 BACKUP AUTOMÁTICO
// =============================
const BACKUP_PATH = path.join(__dirname, "backup.json");

function gerarBackup() {
    try {
        const dados = fs.readFileSync(DB_PATH);
        fs.writeFileSync(BACKUP_PATH, dados);
        console.log("✅ Backup gerado");
    } catch (e) {
        console.log("❌ Erro backup:", e.message);
    }
}
// =============================
// 🤖 GUARDIÃO DO SISTEMA
// =============================
setInterval(() => {
    console.log("🔎 Verificando sistema...");

    try {
        const banco = lerBanco();

        if (!Array.isArray(banco)) {
            throw new Error("Banco corrompido");
        }

        // gerar backup automático
        gerarBackup();

        console.log("🛡️ Sistema íntegro");

    } catch (e) {
        console.log("🚨 ALERTA:", e.message);

        relatorio.erros.push({
            tipo: "sistema",
            erro: e.message,
            data: new Date()
        });
    }

}, 30000); // a cada 30s
app.get("/relatorio", (req, res) => {
    res.json({
        status: "GUARDIÃO ATIVO",
        inicio: relatorio.inicio,
        acessos: relatorio.acessos,
        logins: relatorio.logins,
        cadastros: relatorio.cadastros,
        erros: relatorio.erros,
        backup: fs.existsSync(BACKUP_PATH) ? "OK" : "FALHOU"
    });
});
