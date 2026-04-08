require("dotenv").config();

const express = require("express");
const app = express();

// 🔒 IP permitido (seu acesso)
const IP_PERMITIDO = "127.0.0.1";

app.use((req, res, next) => {
    const ip = req.ip.replace("::ffff:", "");

    if (ip !== IP_PERMITIDO) {
        return res.status(403).send("🚫 Acesso restrito");
    }

    next();
});

// Porta obrigatória do Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});
