// =============================
// 🤖 IA DESIGNER (INTERNO)
// =============================

let relatorio = {
    inicio: new Date(),
    acessos: 0,
    logins: 0,
    cadastros: 0,
    erros: []
};

// monitorar requisições
app.use((req, res, next) => {
    relatorio.acessos++;

    const originalSend = res.send;

    res.send = function (body) {
        try {
            if (req.url.includes("login") && res.statusCode === 200) {
                relatorio.logins++;
            }

            if (req.url.includes("cadastro") && res.statusCode === 200) {
                relatorio.cadastros++;
            }

            if (res.statusCode >= 400) {
                relatorio.erros.push({
                    rota: req.url,
                    status: res.statusCode,
                    data: new Date()
                });
            }

        } catch (e) {}

        return originalSend.call(this, body);
    };

    next();
});
app.get("/relatorio", (req, res) => {
    res.json({
        status: "IA ativa",
        inicio: relatorio.inicio,
        acessos: relatorio.acessos,
        logins: relatorio.logins,
        cadastros: relatorio.cadastros,
        erros: relatorio.erros
    });
});
