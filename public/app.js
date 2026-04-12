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

  console.log("RESPOSTA BACKEND:", data); // 👈 ADICIONA ISSO

  adicionarMensagemNaTela("Luiza: " + data.mensagem);

  if (data.acao === "REDIRECT") {
    console.log("REDIRECIONANDO PARA:", data.destino); // 👈 DEBUG
    window.location.href = data.destino;
  }
}
