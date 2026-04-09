const CHAVE_MASTER = "geo_2026_seguro";

app.post("/login-cert", (req, res) => {
    const { chave } = req.body;

    if (chave === CHAVE_MASTER) {
        return res.json({ ok: true, tipo: "certificado_simulado" });
    }

    res.status(401).json({ ok: false });
});
fetch("/login-cert"
