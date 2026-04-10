<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>GeoUrban</title>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #1b5e20, #4caf50);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
}

.container {
    max-width: 800px;
    background: rgba(0,0,0,0.6);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
}

h1 {
    margin-bottom: 15px;
}

p {
    font-size: 15px;
    line-height: 1.6;
}

.highlight {
    color: #a5d6a7;
    font-weight: bold;
}

.btn {
    margin-top: 20px;
    padding: 12px 25px;
    background: #00c853;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

.btn:hover {
    background: #00e676;
}
</style>
</head>

<body>

<div class="container">

<h1>🌍 GeoUrban</h1>

<p><strong>Contribuindo hoje com decisões melhores para construir o futuro com segurança e inteligência artificial.</strong></p>

<p>
A GeoUrban é uma plataforma desenvolvida para apoiar a tomada de decisões com base em dados,
análise técnica e inteligência artificial, sempre alinhada às normas legais e às boas práticas profissionais.
</p>

<p>
Nosso objetivo é <span class="highlight">auxiliar profissionais em seu desenvolvimento</span>, reduzir falhas operacionais
e fortalecer a qualidade das entregas.
</p>

<p>
A inteligência artificial atua como apoio.
<span class="highlight">Não substituímos profissionais habilitados.</span>
</p>

<p>
Para uso técnico será necessário:
<br>✔ Login no sistema
<br>✔ Inserção de ART / TRT / RRT
<br>✔ Aceite dos termos de responsabilidade
</p>

<p>
Ao final dos processos, poderá ser exigida assinatura digital,
garantindo rastreabilidade e conformidade legal.
</p>

<p class="highlight">
Conteúdos políticos não são permitidos. O sistema realiza bloqueio automático.
</p>

<button class="btn" onclick="entrar()">Entrar no Sistema</button>

</div>

<script>
function entrar(){
    window.location.href = "/login.html";
}
</script>

</body>
</html>
