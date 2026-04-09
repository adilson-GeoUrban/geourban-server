// ================================
// 🧠 IA MONITOR + AUTO CORREÇÃO
// ================================

const fs = require("fs");

// 📁 Garantir arquivo de histórico
const HIST_PATH = "./historico.json";

function registrarEvento(tipo, descricao) {
    const evento = {
        data: new Date().toISOString(),
        tipo,
        descricao
    };

    let historico = [];

    try {
        if (fs.existsSync(HIST_PATH)) {
            historico = JSON.parse(fs.readFileSync(HIST_PATH));
        }
    } catch (erro) {
        console.error("Erro ao ler histórico:", erro.message);
    }

    historico.push(evento);

    try {
        fs.writeFileSync(HIST_PATH, JSON.stringify(historico, null, 2));
    } catch (erro) {
        console.error("Erro ao salvar histórico:", erro.message);
    }
}

// ================================
// 🔍 ROTA DE STATUS
// ================================
app.get('/ia/status', (req, res) => {
    registrarEvento("ok", "Status verificado");

    res.json({
        status: "online",
        servidor: "ativo",
        hora: new Date()
    });
});

// ================================
// 📜 ROTA DE HISTÓRICO
// ================================
app.get('/ia/historico', (req, res) => {
    try {
        if (!fs.existsSync(HIST_PATH)) {
            return res.json([]);
        }

        const dados = JSON.parse(fs.readFileSync(HIST_PATH));
        res.json(dados);

    } catch (erro) {
        registrarEvento("erro", "Falha ao ler histórico");

        res.status(500).json({
            erro: "Falha ao carregar histórico"
        });
    }
});

// ================================
// 🚨 CAPTURA GLOBAL DE ERROS
// ================================
process.on('uncaughtException', (err) => {
    registrarEvento("erro_critico", err.message);
    console.error("Erro crítico:", err);
});

process.on('unhandledRejection', (err) => {
    registrarEvento("erro_async", err);
    console.error("Erro async:", err);
});
