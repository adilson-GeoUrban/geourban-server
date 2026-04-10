geourban-server/
└── public/
     └── cadastro.html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Cadastro - GeoUrban</title>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #1b5e20, #4caf50);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
}

.container {
    background: rgba(0,0,0,0.7);
    padding: 30px;
    border-radius: 15px;
    width: 350px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

input, select {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    border-radius: 8px;
    border: none;
}

button {
    width: 100%;
    padding: 12px;
    margin-top: 15px;
    background: #00c853;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #00e676;
}
</style>
</head>

<body>

<div class="container">

<h2>Cadastro Profissional</h2>

<input id="nome" placeholder="Nome completo">

<select id="escolaridade">
    <option value="">Escolaridade</option>
    <option>Fundamental</option>
    <option>Médio</option>
    <option>Técnico</option>
    <option>Superior</option>
</select>

<input id="profissao" placeholder="Profissão">
<input id="limitacoes" placeholder="Limitações (se houver)">
<input id="registro" placeholder="Registro (ART/TRT/RRT se aplicável)">

<button onclick="salvarCadastro()">Cadastrar</button>

</div>

<script>
async function salvarCadastro(){

  const dados = {
    nome: document.getElementById("nome").value,
    escolaridade: document.getElementById("escolaridade").value,
    profissao: document.getElementById("profissao").value,
    limitacoes: document.getElementById("limitacoes").value,
    registro: document.getElementById("registro").value
  };

  const res = await fetch("/cadastro", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      ...dados,
      declaracao: true
    })
  });

  const resposta = await res.json();

  if(resposta.ok){
    alert("✅ Cadastro realizado com sucesso!");
    window.location.href = "/";
  } else {
    alert("❌ " + resposta.erro);
  }
}
</script>

</body>
</html>
