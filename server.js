const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= CONFIG =================
const JWT_SECRET = process.env.JWT_SECRET || "trocar_urgente";
const USERS_PATH = path.join(__dirname, "users.json");
const LOG_PATH = path.join(__dirname, "logs.json");

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= TESTE =================
app.get('/teste', (req, res) => {
    res.send("SERVIDOR OK");
});

// ================= START =================
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
