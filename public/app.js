// 🔐 INÍCIO CONTROLADO
document.addEventListener("DOMContentLoaded", () => {

  // 🔐 AVISO LEGAL COM FUNDO IMAGEM
  function criarAvisoLegal() {
    let aviso = document.getElementById("aviso-legal");

    if (!aviso) {
      aviso = document.createElement("div");
      aviso.id = "aviso-legal";

      // 🌆 FUNDO COM IMAGEM
      aviso.style.position = "fixed";
      aviso.style.top = "0";
      aviso.style.left = "0";
      aviso.style.width = "100%";
      aviso.style.height = "100%";
      aviso.style.background = "url('bg.jpg') no-repeat center center / cover";
      aviso.style.display = "flex";
      aviso.style.alignItems = "center";
      aviso.style.justifyContent = "center";
      aviso.style.zIndex = "10000";

      // 🔒 OVERLAY ESCURO
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.75)";
      overlay.style.backdropFilter = "blur(4px)";

      // 📦 CONTEÚDO
      const conteudo = document.createElement("div");
      conteudo.style.position = "relative";
      conteudo.style.maxWidth = "600px";
      conteudo.style.background = "rgba(0,0,0,0.6)";
      conteudo.style.padding = "30px";
      conteudo.style.borderRadius = "12px";
      conteudo.style.color = "white";
      conteudo.style.textAlign = "center";
      conteudo.style.boxShadow = "0 0 25px rgba(0,255,100,0.3)";

      conteudo.innerHTML = `
        <h2>🌐 GeoUrban Intelligence</h2>

        <p style="margin-top:15px;">
          ⚠️ Sistema em desenvolvimento.<br>
          Seus dados são protegidos conforme a LGPD.
        </p>

        <p style="margin-top:10px; font-size:14px; color:#ccc;">
          É proibida qualquer cópia, reprodução, engenharia reversa ou tentativa de acesso indevido.
          Sujeito à legislação vigente.
        </p>

        <button id="btn-aceitar" style="
          margin-top:20px;
          padding:12px 25px;
          background:#00ff88;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        ">
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
  const aceito = localStorage.getItem("aviso_aceito");
  if (aceito !== "true") {
    criarAvisoLegal();
    return;
  }

  // 🔐 DADOS
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("usuario");

  // 🚫 BLOQUEIO
  function bloquearAcesso() {
    localStorage.clear();
    window.location.href = "login.html";
  }

  // 🤖 ROBÔ
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
  }

  // 🔎 VALIDAÇÃO (BACKEND)
  function validarAcesso() {
    if (!token || !user) {
      mostrarMensagem("Acesso não autorizado 🔒");
      bloquearAcesso();
      return;
    }

    fetch("https://geourban-server-production.up.railway.app/protegido", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(res => {
      if (res.status !== 200) {
        bloquearAcesso();
      }
    })
    .catch(() => bloquearAcesso());
  }

  validarAcesso();

  // 👤 USUÁRIO
  const userEl = document.getElementById("usuario");
  if (userEl) {
    userEl.innerText = "Usuário: " + user;
  }

  // 📦 CAMADAS
  let camadas = JSON.parse(localStorage.getItem("camadas") || "[]");

  if (!camadas || camadas.length === 0) {
    camadas = ["educacao"];
    localStorage.setItem("camadas", JSON.stringify(camadas));
  }

  // 🎯 PAINEL
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
    mostrarMensagem("Abrindo módulo: " + nome);
  }

  if (painel) {
    camadas.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = mapa[c] || c;

      div.onclick = () => abrirModulo(mapa[c] || c);

      painel.appendChild(div);

      if (i === 0) {
        setTimeout(() => abrirModulo(mapa[c] || c), 800);
      }
    });
  }

});
