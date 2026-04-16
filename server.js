<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>GeoUrban Painel</title>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: #111;
  color: white;
}

header {
  background: #000;
  padding: 15px;
  display: flex;
  justify-content: space-between;
}

button {
  background: red;
  border: none;
  padding: 10px;
  color: white;
  cursor: pointer;
}

main {
  padding: 20px;
}
</style>
</head>

<body>

<header>
  <h2>GeoUrban</h2>
  <button onclick="logout()">Sair</button>
</header>

<main>
  <h1 id="user"></h1>
  <p>Sistema operacional</p>
</main>

<script>
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById('user').innerText = "Logado como: " + user.email;

function logout() {
  localStorage.removeItem('user');
  window.location.href = "login.html";
}
</script>

</body>
</html>
