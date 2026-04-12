function adicionarMensagemNaTela(msg) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.innerText = msg;

  chat.appendChild(div);

  // auto scroll
  chat.scrollTop = chat.scrollHeight;
}

async function enviar() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();

  if (!input) return;

  // mostra o que o usuário digitou
  adicionarMensagemNaTela("Você: " + input);

  inputEl.value = "";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comando: input })
    });

    const data = await res.json();

    adicionarMensagemNaTela("Luiza: " + data.mensagem);

    if (data.acao === "REDIRECT") {
      setTimeout(() => {
        window.location.href = data.destino;
      }, 1000); // pequeno delay pra ver a mensagem
    }

  } catch (erro) {
    adicionarMensagemNaTela("Erro ao conectar com o servidor");
  }
}
