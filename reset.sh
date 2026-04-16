#!/bin/bash

echo "🧹 Limpando projeto..."

rm -rf node_modules
rm -f package-lock.json

echo "📦 Reinstalando dependências básicas..."
npm install express cors

echo "📁 Garantindo package.json padrão..."

cat > package.json <<EOF
{
  "name": "geourban",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF

echo "✅ Projeto restaurado com base limpa"
