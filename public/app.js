<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>GeoUrban IA</title>

  <!-- 🔒 Segurança -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">

</head>

<body style="background:black; color:white; font-family: Arial; text-align:center;">

  <h2>🤖 IA Luiza</h2>

  <div id="chat" style="
    height:300px;
    max-width:600px;
    margin:20px auto;
    overflow:auto;
    border:1px solid #555;
    padding:10px;
    text-align:left;
  "></div>

  <input id="input" type="text" placeholder="Digite..." style="padding:10px; width:60%;">
  <button onclick="enviar()" style="padding:10px;">OK</button>

  <script>
    function adicionarMensagemNaTela(msg) {
      const chat = document.getElementById("chat");

      const p = document.createElement("p");
      p.innerText = msg; // 🔒 seguro

      chat.appendChild(p);
      chat.scrollTop = chat.scrollHeight;
    }

    async function enviar() {
      const inputEl = document.getElementById("input");
      const input = inputEl.value.trim();

      if (!input) return;

      adicionarMensagemNaTela("Você: " + input);
      inputEl.value = "";

      // 🤖 efeito digitando
      adicionarMensagemNaTela("Luiza está digitando...");

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch("/ia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ mensagem: input }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        const data = await res.json();

        const chat = document.getElementById("chat");

        // 🔒 validação
        if (!data || !data.mensagem) {
          chat.lastChild.innerText = "Sistema: resposta inválida";
          return;
        }

        // atualiza mensagem digitando
        chat.lastChild.innerText = "Luiza: " + data.mensagem;

        // 🚀 redirecionamento
        if (data.acao === "REDIRECT") {
          setTimeout(() => {
            window.location.href = data.destino;
          }, 800);
        }

      } catch (erro) {
        const chat = document.getElementById("chat");
        chat.lastChild.innerText = "Erro ao conectar com servidor";
      }
    }

    // ⌨️ enviar com ENTER
    document.getElementById("input").addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        enviar();
      }
    });
  </script>

</body>
</html>
