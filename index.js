<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>GeoUrban 🚀</title>
  <style>
    body { font-family: Arial; background:#0f172a; color:#fff; padding:20px; }
    input, button { padding:10px; margin:5px; border-radius:8px; border:none; }
    button { background:#22c55e; cursor:pointer; }
    .box { background:#1e293b; padding:20px; border-radius:12px; margin-top:20px; }
  </style>
</head>
<body>

<h1>GeoUrban Online 🚀</h1>

<div class="box">
  <input id="descricao" placeholder="Descrição da operação">
  <input id="valor" type="number" placeholder="Valor (R$)">
  <button onclick="executar()">Analisar</button>
</div>

<div id="resultado" class="box"></div>

<script>

// 🔐 VALIDAÇÃO SEGURA
function validarOperacao(dados) {
  if (!dados) return "erro";

  if (!dados.valor || dados.valor <= 0) {
    return "valor_invalido";
  }

  if (!dados.descricao || dados.descricao.trim() === "") {
    return "descricao_vazia";
  }

  return "ok";
}

// 🧠 IA PRINCIPAL CORRIGIDA
function sistema(dados) {
  try {

    const status = validarOperacao(dados);

    if (status !== "ok") {
      return { erro: status };
    }

    const valor = Number(dados.valor);
    const descricao = dados.descricao.toLowerCase();

    let risco = "baixo";
    let lucro = valor * 0.2;
    let imposto = valor * 0.1;

    // 🔍 LÓGICA INTELIGENTE
    if (descricao.includes("importação")) {
      risco = "medio";
      imposto = valor * 0.25;
    }

    if (descricao.includes("alto risco")) {
      risco = "alto";
      lucro = valor * 0.1;
    }

    return {
      risco,
      lucro: lucro.toFixed(2),
      imposto: imposto.toFixed(2),
      recomendacao: gerarRecomendacao(risco)
    };

  } catch (erro) {
    console.log("❌ Erro no sistema:", erro.message);
    return { erro: "falha_sistema" };
  }
}

// 🤖 RECOMENDAÇÃO
function gerarRecomendacao(risco) {
  if (risco === "alto") return "⚠️ Evitar operação";
  if (risco === "medio") return "⚠️ Atenção";
  return "✅ Operação segura";
}

// ▶️ EXECUÇÃO
function executar() {
  try {
    const dados = {
      descricao: document.getElementById("descricao").value,
      valor: parseFloat(document.getElementById("valor").value)
    };

    const resposta = sistema(dados);

    document.getElementById("resultado").innerHTML =
      "<pre>" + JSON.stringify(resposta, null, 2) + "</pre>";

  } catch (erro) {
    document.getElementById("resultado").innerHTML =
      "Erro na execução";
  }
}

</script>

</body>
</html>
