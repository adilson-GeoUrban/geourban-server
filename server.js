<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>GeoUrban Ultra</title>
</head>

<body style="background:black;color:lime;text-align:center;font-family:Arial">

<h2>🚀 GeoUrban - Painel</h2>

<button onclick="login()">Entrar</button>
<button onclick="ia()">IA</button>
<button onclick="logs()">Logs</button>

<div id="tela"></div>

<script>
function login(){
    tela.innerHTML = "🔐 Login realizado";
}

function ia(){
    let tema = prompt("Tema:");
    tela.innerHTML = "📘 Aula sobre " + tema;
}

function logs(){
    tela.innerHTML = "📊 Logs ativos";
}
</script>

</body>
</html>
