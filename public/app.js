function adicionarMensagemNaTela(msg) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p>${msg}</p>`;
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

    adicionarMensagemNaTela("Luiza: " + data.mensagem);

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
