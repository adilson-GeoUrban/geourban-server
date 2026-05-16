async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("status");

  if (!email || !password) {
    status.innerText = "Preencha todos os campos";
    return;
  }

  status.innerText = "Conectando...";

  try {

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data || !data.success) {
      status.innerText = "Credenciais inválidas";
      return;
    }

    // 🔐 proteção contra backend incompleto
    const userEmail = data.user?.email || email;

    // 💾 sessão blindada
    localStorage.setItem("token", data.token || "demo");
    localStorage.setItem("usuario", userEmail);

    status.innerText = "OK";

    // 🚀 redirect seguro (SEM HEAD, SEM fetch, SEM Render bug)
    setTimeout(() => {
      window.location.replace("/ia.html");
    }, 400);

  } catch (e) {
    console.error(e);
    status.innerText = "Erro servidor";
  }
}
