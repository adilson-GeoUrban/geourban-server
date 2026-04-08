const IP_PERMITIDO = "127.0.0.1";
const ip = req.ip;
const IP_PERMITIDO = "127.0.0.1";

app.use((req, res, next) => {
    const ip = req.ip.replace("::ffff:", "");

    if (ip !== IP_PERMITIDO) {
        return res.status(403).send("🚫 Acesso restrito");
    }

    next();
});
