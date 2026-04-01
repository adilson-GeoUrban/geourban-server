#!/bin/bash

echo "🤖 RESET SIMPLES..."

# mata qualquer coisa travada
pkill -f node 2>/dev/null

# limpa só o essencial
rm -rf node_modules package-lock.json src index.js

# cria app simples
cat > index.js << 'CODE'
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("GeoUrban ONLINE 🚀");
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log("Rodando na porta", port);
});
CODE

# cria package.json básico
cat > package.json << 'CODE'
{
  "name": "geourban",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  }
}
CODE

# instala e roda
npm install express
npm start
