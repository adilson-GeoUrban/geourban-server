const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
