const fs = require("fs");

// caminho dos arquivos importantes
const arquivos = [
    "./server.js",
    "./public/index.html",
    "./logs.txt",
    "./backup.json"
];

// pasta do ponto de restauração
const ponto = "./backup_pre_chave";

// criar pasta se não existir
if (!fs.existsSync(ponto)) fs.mkdirSync(ponto);

// copiar arquivos
arquivos.forEach(file => {
    if (fs.existsSync(file)) {
        const nome = file.split("/").pop();
        fs.copyFileSync(file, `${ponto}/${nome}`);
    }
});

console.log("✅ Ponto de restauração criado com sucesso!");
