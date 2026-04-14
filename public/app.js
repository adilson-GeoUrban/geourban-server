// 🔐 INÍCIO CONTROLADO
document.addEventListener("DOMContentLoaded", () => {

  // 🔐 AVISO LEGAL
  function criarAvisoLegal() {
    let aviso = document.getElementById("aviso-legal");

    if (!aviso) {
      aviso = document.createElement("div");
      aviso.id = "aviso-legal";

      aviso.style.position = "fixed";
      aviso.style.top = "0";
      aviso.style.left = "0";
      aviso.style.width = "100%";
      aviso.style.height = "100%";
      aviso.style.background = "url('bg.jpg'), #000";
      aviso.style.backgroundSize = "cover";
      aviso.style.display = "flex";
      aviso.style.alignItems = "center";
      aviso.style.justifyContent = "center";
      aviso.style.zIndex = "10000";

      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.75)";

      const conteudo = document.createElement("div");
      conteudo.style.position = "relative";
      conteudo.style.maxWidth = "600px";
      conteudo.style.background = "rgba(0,0,0,0.7)";
      conteudo.style.padding = "30px";
      conteudo.style.borderRadius = "12px";
      conteudo.style.color = "white";
      conteudo.style.textAlign = "center";

      conteudo.innerHTML = `
        <h2>🌐 GeoUrban Intelligence</h2>
        <p style="margin-top:15px;">
          ⚠️ Sistema em desenvolvimento.<br>
          Seus dados são protegidos conforme a LGPD.
        </p>
        <button id="btn-aceitar" style="
          margin-top:20px;
          padding:12px 25px;
          background:#00ff88;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;">
          Aceito e continuar
        </button>
      `;

      aviso.appendChild(overlay);
      aviso.appendChild(conteudo);
      document.body.appendChild(aviso);

      document.getElementById("btn-aceitar").onclick = () => {
        localStorage.setItem("aviso_aceito", "true");
        aviso.style.display = "none";
      };
    }
  }

  // 🔎 VERIFICA ACEITE
  if (localStorage.getItem("aviso_aceito") !== "true") {
    criarAvisoLegal();
    return;
  }

  // 🔐 DADOS
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("usuario");

  function bloquearAcesso() {
    localStorage.clear();
    window.location.href = "/login.html";
  }

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
  }

  // 🔐 VALIDA TOKEN LOCAL
  if (!token || !user) {
    mostrarMensagem("Acesso não autorizado 🔒");
    bloquearAcesso();
    return;
  }

  try {
    const decoded = atob(token);
    const [userToken, timestamp] = decoded.split("|");

    const expirado = (Date.now() - parseInt(timestamp)) > (2 * 60 * 60 * 1000);

    if (!userToken || expirado) {
      mostrarMensagem("Sessão expirada ⏳");
      bloquearAcesso();
      return;
    }

  } catch {
    bloquearAcesso();
    return;
  }

  // 🔎 VALIDAÇÃO BACKEND (CORRIGIDO)
  fetch("https://geourban-server-production.up.railway.app/protegido", {
    headers: {
      "Authorization": token,
      "x-api-key": "SUA_API_KEY_AQUI"
    }
  })
  .then(res => {
    if (res.status !== 200) {
      bloquearAcesso();
    } else {
      mostrarMensagem("Bem-vindo, " + user + " 👋");
    }
  })
  .catch(() => {
    mostrarMensagem("Erro de conexão ⚠️");
    setTimeout(() => bloquearAcesso(), 1500);
  });

  // 👤 USUÁRIO
  const userEl = document.getElementById("usuario");
  if (userEl) {
    userEl.innerText = "Usuário: " + user;
  }

  // 📦 CAMADAS
  let camadas = JSON.parse(localStorage.getItem("camadas") || "[]");

  if (!camadas.length) {
    camadas = ["educacao"];
    localStorage.setItem("camadas", JSON.stringify(camadas));
  }

  const painel = document.getElementById("painel");

  const mapa = {
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
    mostrarMensagem("Abrindo: " + nome);
  }

  if (painel) {
    camadas.forEach((c, i) => {
      const div = document.createElement("div");

      div.innerText = mapa[c] || c;
      div.style.padding = "20px";
      div.style.margin = "10px";
      div.style.background = "#1a1a1a";
      div.style.borderRadius = "10px";
      div.style.cursor = "pointer";
      div.style.boxShadow = "0 0 10px rgba(0,255,100,0.2)";
      div.style.transition = "0.3s";

      div.onmouseover = () => div.style.transform = "scale(1.05)";
      div.onmouseout = () => div.style.transform = "scale(1)";

      div.onclick = () => abrirModulo(mapa[c] || c);

      painel.appendChild(div);

      if (i === 0) {
        setTimeout(() => abrirModulo(mapa[c] || c), 800);
      }
    });
  }

});
