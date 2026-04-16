app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GeoUrban</title>
      <style>
        body { background:#111; color:white; font-family:Arial; display:flex; justify-content:center; align-items:center; height:100vh; }
        .box { background:#222; padding:30px; border-radius:10px; width:300px; text-align:center; }
        input, button { width:100%; padding:10px; margin:10px 0; }
        button { background:#00ff88; border:none; cursor:pointer; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>GeoUrban</h2>
        <input id="email" placeholder="Email">
        <input id="password" type="password" placeholder="Senha">
        <button onclick="login()">Entrar</button>
        <p id="status"></p>
      </div>

      <script>
        async function login() {
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const status = document.getElementById("status");

          try {
            const res = await fetch("/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
              status.innerText = "❌ Credenciais inválidas";
              return;
            }

            status.innerText = "✅ Login OK";
          } catch {
            status.innerText = "❌ Erro servidor";
          }
        }
      </script>
    </body>
    </html>
  `);
});
