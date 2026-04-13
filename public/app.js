// 🔐 INÍCIO CONTROLADO
document.addEventListener("DOMContentLoaded", () => {

  const user = localStorage.getItem("usuario");
  let camadas = JSON.parse(localStorage.getItem("camadas") || "[]");

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  if (!camadas || camadas.length === 0) {
    camadas = ["educacao"];
    localStorage.setItem("camadas", JSON.stringify(camadas));
  }

  document.getElementById("usuario").innerText = "Usuário: " + user;

  const painel = document.getElementById("painel");

  const mapaModulos = {
    educacao: "📚 Educação",
    cursos: "🎓 Cursos",
    simulacoes: "🧪 Simulações",
    consultoria: "🧠 Consultoria",
    clientes: "👥 Clientes",
    cadastro_tecnico: "📄 Cadastro Técnico",
    loja: "🛒 Loja",
    gestao: "🏛️ Gestão",
    auditoria: "🔍 Auditoria",
    relatorios: "📊 Relatórios",
    controle: "⚙️ Controle"
  };

  function abrirModulo(nome) {
    alert("Abrindo módulo: " + nome);
  }

  camadas.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = mapaModulos[c] || c;

    div.onclick = () => abrirModulo(mapaModulos[c] || c);

    painel.appendChild(div);

    if (i === 0) {
      setTimeout(() => {
        abrirModulo(mapaModulos[c] || c);
      }, 800);
    }
  });

});

// 🌍 LAZY LOAD DO MAPA
let mapaCarregado = false;

function carregarMapa() {
  if (mapaCarregado) return;

  document.getElementById("map").style.display = "block";

  const map = L.map('map').setView([-15, -55], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'GeoUrban © OpenStreetMap'
  }).addTo(map);

  L.marker([-14.2350, -51.9253])
    .addTo(map)
    .bindPopup("Brasil - GeoUrban Ativo");

  mapaCarregado = true;
}
