const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Caminhos
const pastaBackup = path.join(__dirname, "backup");
const output = fs.createWriteStream(path.join(__dirname, "geourban_backup.zip"));
const archive = archiver("zip", { zlib: { level: 9 } });

// Progressão
archive.on("error", err => { throw err; });
archive.pipe(output);

// Adiciona todos os arquivos da pasta backup
archive.directory(pastaBackup, false);

// Finaliza
archive.finalize();
