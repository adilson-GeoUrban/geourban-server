const express = require("express");
const app = express();

// =======================
// MIDDLEWARE (OBRIGATÓRIO)
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// FRONTEND (SEU CÓDIGO)
// =======================
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>GeoUrban</title>

      <style>
        body {
          background: #111;
          color: #fff;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .box {
          background: #222;
          padding: 30px;
          border-radius: 10px;
          width: 320px;
          text-align: center;
        }

        input, button {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          border: none;
          outline: none;
        }

        input {
          background: #333;
          color: #fff;
        }

        button {
          background: #00ff88;
          cursor: pointer;
          font-weight: bold;
        }

        button:hover {
          background: #00cc6a;
        }

        #status {
          margin-top: 10px;
          font-size: 14px;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h2>GeoUrban</h2>

        <input id="email" type="email" placeholder="Email" />
        <input id="password" type="password" placeholder="Senha" />

        <button onclick="login()">Entrar</button>

        <p id="status"></p>
      </div>

      <script>
        async function login() {
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value.trim();
          const status = document.getElementById("status");

          status.innerText = "Carregando...";

          try {
            const res = await fetch("/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
              status.innerText = "✅ Login OK";
            } else {
              status.innerText = "❌ Credenciais inválidas";
            }

          } catch (err) {
            console.error(err);
            status.innerText = "❌ Erro de conexão com servidor";
          }
        }
      </script>
    </body>
    </html>
  `);
});

// =======================
// LOGIN (ROBO BACKEND)
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, error: "missing_data" });
  }

  // regra simples de teste (robô)
  if (email === "admin" && password === "123") {
    return res.json({ success: true, token: "geo-token-ok" });
  }

  return res.json({ success: false });
});

// =======================
// HEALTH CHECK (IMPORTANTE)
// =======================
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// =======================
// START (RAILWAY)
// =======================
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("[ROBO] GeoUrban rodando na porta " + PORT);
});
