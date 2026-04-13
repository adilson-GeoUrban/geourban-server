<script>
// 🔐 INÍCIO CONTROLADO
document.addEventListener("DOMContentLoaded", () => {

  const user = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");
  let camadas = JSON.parse(localStorage.getItem("camadas") || "[]");

  // 🚫 BLOQUEIO TOTAL
  function bloquearAcesso() {
    localStorage.clear();
    window.location.href = "/login.html";
  }

  // 🤖 ROBÔ (mensagem inteligente)
  function mostrarMensagem(msg) {
    let box = document.getElementById("robo-msg");

    if (!box) {
      box = document.createElement("div");
      box.id = "robo-msg";
      box.style.position = "fixed";
      box.style.bottom = "20px";
      box.style.right = "20px";
      box.style.background = "#111";
      box.style.color = "#0f0";
      box.style.padding = "10px";
      box.style.borderRadius = "8px";
      box.style.zIndex = "9999";
      document.body.appendChild(box);
    }

    box.innerText = msg;
    box.style.display = "block";

    // 🔥 auto esconder
    setTimeout(() => {
      box.style.display = "none";
    }, 3000);
  }

  // 🔐 VALIDAÇÃO REAL (ANTI BYPASS)
  function validarSessao() {
    if (!token || !user) {
      mostrarMensagem("Acesso não autorizado 🔒");
      bloquearAcesso();
      return;
    }

    fetch("/protegido", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(res => {
      if (res.status !== 200) {
        mostrarMensagem("Sessão inválida ⚠️");
        bloquearAcesso();
      }
    })
    .catch(() => {
      mostrarMensagem("Erro de conexão 🚫");
      bloquearAcesso();
    });
  }

  validarSessao();

  // 📦 PADRÃO CAMADAS
  if (!camadas || camadas.length === 0) {
    camadas = ["educacao"];
    localStorage.setItem("camadas", JSON.stringify(camadas));
  }

  // 👤 USUÁRIO
  const userEl = document.getElementById("usuario");
  if (userEl) {
    userEl.innerText = "Usuário: " + user;
  }

  // 🎯 PAINEL
  const painel = document.getElementById("painel");

  if (!painel) {
    console.warn("Painel não encontrado");
    return;
  }

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
    mostrarMensagem("Abrindo módulo: " + nome);
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


// 🌍 MAPA (LAZY LOAD SEGURO)
let mapaCarregado = false;

function carregarMapa() {
  if (mapaCarregado) return;

  const mapEl = document.getElementById("map");

  if (!mapEl || typeof L === "undefined") {
    console.warn("Mapa não disponível ainda");
    return;
  }

  mapEl.style.display = "block";

  const map = L.map('map').setView([-15, -55], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'GeoUrban © OpenStreetMap'
  }).addTo(map);

  L.marker([-14.2350, -51.9253])
    .addTo(map)
    .bindPopup("Brasil - GeoUrban Ativo");

  mapaCarregado = true;
}
</script>
