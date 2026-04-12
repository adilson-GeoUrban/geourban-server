async function enviar() {
  const input = document.getElementById("input").value;

  if (!input) return;

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comando: input })
    });

    const data = await res.json();

    console.log("Resposta:", data);

    // Mostra resposta (simples por enquanto)
    alert(data.mensagem);

    // 🔥 EXECUTA AÇÃO REAL
    if (data.acao === "REDIRECT") {
      window.location.href = data.destino;
    }

  } catch (err) {
    console.error("Erro:", err);
    alert("Erro na comunicação com servidor");
  }
}
