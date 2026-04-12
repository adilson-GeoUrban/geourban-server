function adicionarMensagemNaTela(msg) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.innerText = msg;
  chat.appendChild(div);
}

async function enviar() {
  const input = document.getElementById("input").value;

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
    window.location.href = data.destino;
  }
}
