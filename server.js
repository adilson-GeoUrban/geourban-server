// ===============================
// 🔒 SISTEMA DE AUDITORIA + BACKUP
// ===============================

const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "historico.json");

// Criar arquivo se não existir
if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify([]));
}

// Função de registrar evento
function registrarEvento(tipo, descricao) {
    const historico = JSON.parse(fs.readFileSync(logPath));

    historico.push({
        data: new Date().toISOString(),
        tipo,
        descricao
    });

    fs.writeFileSync(logPath, JSON.stringify(historico, null, 2));
}

// ===============================
// 📊 ROTAS DE MONITORAMENTO
// ===============================

// Status do sistema
app.get("/ia/status", (req, res) => {
    res.json({
        status: "online",
        hora: new Date()
    });
});

// Histórico completo
app.get("/ia/historico", (req, res) => {
    const historico = JSON.parse(fs.readFileSync(logPath));
    res.json(historico);
});

// Registrar erro manual
app.get("/ia/erro", (req, res) => {
    registrarEvento("erro", "Erro detectado manualmente");
    res.send("Erro registrado");
});
