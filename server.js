const express = require("express");
const app = express();

app.use(express.json());

let logs = [];

app.get("/", (req, res) => {
    res.send("BD2 rodando");
});

app.post("/login", (req, res) => {
    const { user, pass } = req.body;

    if (user === "admin" && pass === "1234") {
        logs.push("LOGIN OK");
        return res.json({ ok: true });
    } else {
        logs.push("LOGIN ERRO");
        return res.status(401).json({ erro: true });
    }
});

app.get("/logs", (req, res) => {
    res.json(logs);
});

app.listen(3000, () => {
    console.log("BD2 rodando em http://localhost:3000");
});
