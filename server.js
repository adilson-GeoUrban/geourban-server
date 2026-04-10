// =============================
// 🤖 IA DESIGNER (INTERNO BLINDADO)
// =============================

let relatorio = {
    inicio: new Date(),
    acessos: 0,
    logins: 0,
    cadastros: 0,
    erros: []
};

app.use((req, res, next) => {
    relatorio.acessos++;

    const originalJson = res.json;
    const originalSend = res.send;

    function registrar() {
        try {
            if (req.url.includes("/login") && res.statusCode === 200) {
                relatorio.logins++;
            }

            if (req.url.includes("/cadastro") && res.statusCode === 200) {
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
    }

    res.json = function (body) {
        registrar();
        return originalJson.call(this, body);
    };

    res.send = function (body) {
        registrar();
        return originalSend.call(this, body);
    };

    next();
});

// =============================
// 📊 RELATÓRIO
// =============================
app.get("/relatorio", (req, res) => {
    res.json({
        status: "IA ativa e monitorando",
        inicio: relatorio.inicio,
        acessos: relatorio.acessos,
        logins: relatorio.logins,
        cadastros: relatorio.cadastros,
        erros: relatorio.erros
    });
});
