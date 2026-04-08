const express = require("express");
const app = express();

app.use(express.json());

const USER = "admin";
const PASS = "1234";

let logs = [];

app.get("/", (req, res) => {
    res.send("BD2 rodando");
});

app.post("/login", (req, res) => {
    const { user, pass } = req.body;

    if (user === USER && pass === PASS) {
        logs.push("LOGIN OK");
        return res.json({ ok: true });
    } else {
        logs.push("LOGIN ERRO");
        return res.status(401).json({ erro: "Login inválido" });
    }
});

app.get("/logs", (req, res) => {
    res.json(logs);
});

app.listen(3000, () => {
    console.log("BD2 rodando em http://localhost:3000");
});
