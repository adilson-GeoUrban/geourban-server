server.js
// ===============================
// 🤖 IA MONITOR AUTOMÁTICO
// ===============================

function verificarSistema() {
    try {
        // Simulação de verificação interna
        const status = true; // aqui depois pode validar banco, arquivos, etc

        if (!status) {
            registrarEvento("erro", "Falha detectada automaticamente");
        } else {
            registrarEvento("ok", "Sistema verificado e estável");
        }

    } catch (erro) {
        registrarEvento("erro_critico", erro.message);
    }
}

// Executa a cada 30 segundos
setInterval(verificarSistema, 30000);
