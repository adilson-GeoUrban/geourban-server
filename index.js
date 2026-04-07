<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>GeoUrban - Painel</title>

  <style>
    body {
      font-family: Arial;
      margin: 0;
      background: #0f172a;
      color: white;
      text-align: center;
    }

    header {
      background: #020617;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 2px solid #1e293b;
    }

    .container {
      padding: 30px;
    }

    .card {
      background: #1e293b;
      margin: 15px;
      padding: 20px;
      border-radius: 10px;
      display: inline-block;
      width: 250px;
    }

    button {
      background: #22c55e;
      border: none;
      padding: 10px 15px;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background: #16a34a;
    }
  </style>
</head>

<body>

<header>
  🚀 GeoUrban - Sistema Unificado
</header>

<div class="container">

  <div class="card">
    <h2>📊 Dashboard</h2>
    <p>Status do sistema</p>
    <button onclick="alert('Sistema rodando!')">Ver status</button>
  </div>

  <div class="card">
    <h2>🧪 Laboratório</h2>
    <p>Área de testes</p>
    <button onclick="alert('Modo teste ativo')">Testar</button>
  </div>

  <div class="card">
    <h2>🛒 Loja</h2>
    <p>Área comercial</p>
    <button onclick="alert('Em breve')">Abrir</button>
  </div>

</div>

<script>
  console.log("✅ GeoUrban carregado com sucesso");
</script>

</body>
</html>
// =======================================
// 🔐 BLOCO SALVAR (BACKUP AUTOMÁTICO)
// =======================================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// 📁 Caminhos
const pastaBackup = path.join(__dirname, "backup");
const arquivoDados = path.join(__dirname, "dados.json");

// 📁 Criar pasta se não existir
if (!fs.existsSync(pastaBackup)) {
  fs.mkdirSync(pastaBackup);
}

// 💾 Função principal de salvar
function salvarDados(dados) {
  try {
    // Salva JSON
    fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2));

    // Cria nome do backup
    const nome = `backup_${Date.now()}.json.gz`;
    const caminhoBackup = path.join(pastaBackup, nome);

    // Compacta e salva
    const gzip = zlib.createGzip();
    const stream = fs.createReadStream(arquivoDados);
    const destino = fs.createWriteStream(caminhoBackup);

    stream.pipe(gzip).pipe(destino);

    console.log("✅ Backup salvo:", nome);

  } catch (erro) {
    console.log("❌ Erro ao salvar:", erro.message);
  }
}

// 🌐 Rota para salvar (teste)
app.post("/salvar", express.json(), (req, res) => {
  const dados = req.body;

  salvarDados(dados);

  res.json({ status: "ok", mensagem: "Dados salvos com backup!" });
});
