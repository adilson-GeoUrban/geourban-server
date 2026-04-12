<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>GeoUrban IA</title>
</head>
<body style="background:black; color:white;">

  <h2>IA Luiza</h2>

  <div id="chat" style="height:300px; overflow:auto; border:1px solid #555; padding:10px;"></div>

  <input id="input" type="text" placeholder="Digite..." />
  <button onclick="enviar()">OK</button>

  <script>
    function adicionarMensagemNaTela(msg) {
      const chat = document.getElementById("chat");

      const p = document.createElement("p");
      p.innerText = msg; // 🔒 seguro (ANTI HACK)

      chat.appendChild(p);
      chat.scrollTop = chat.scrollHeight;
    }

    async function enviar() {
      const inputEl = document.getElementById("input");
      const input = inputEl.value.trim();

      if (!input) return;

      adicionarMensagemNaTela("Você: " + input);

      try {
        const res = await fetch("/ia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ mensagem: input })
        });

        const data = await res.json();

        // 🔒 validação segura
        if (!data || !data.mensagem) {
          adicionarMensagemNaTela("Sistema: resposta inválida do servidor");
          return;
        }

        adicionarMensagemNaTela("Luiza: " + data.mensagem);

        // 🚀 ação automática
        if (data.acao === "REDIRECT") {
          setTimeout(() => {
            window.location.href = data.destino;
          }, 800);
        }

      } catch (erro) {
        adicionarMensagemNaTela("Erro ao conectar com servidor");
      }

      inputEl.value = "";
    }
  </script>

</body>
</html>
