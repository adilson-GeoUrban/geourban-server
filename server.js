const SESSOES = {};

// 🔐 LOGIN SOBERANO
app.post("/login", (req, res) => {
    const { chave } = req.body;

    if (chave === CHAVE_SOBERANO) {
        const token = Math.random().toString(36).substring(2);

        SESSOES[token] = true;

        return res.send({ token });
    }

    return res.status(403).send("🚫 Chave inválida");
});

// 🔐 NOVO MIDDLEWARE (usa token)
function autenticar(req, res, next) {
    const token = req.headers["x-token"];

    if (!SESSOES[token]) {
        return res.status(403).send("🚫 NÃO AUTORIZADO");
    }

    next();
}
