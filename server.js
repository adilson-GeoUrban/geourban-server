const express = require("express");
const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// LOG BÁSICO DE DEBUG (IMPORTANTE EM PRODUÇÃO)
// =======================
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// =======================
// FRONTEND
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
          font-family: Arial;
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

        input { background: #333; color: #fff; }

        button {
          background: #00ff88;
          cursor: pointer;
          font-weight: bold;
        }

        #status { margin-top: 10px; font-size: 14px; }
      </style>
    </head>

    <body>
      <div class="box">
        <h2>GeoUrban</h2>

        <input id="email" placeholder="Email" />
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
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
              status.innerText = "✅ Login OK";
            } else {
              status.innerText = "❌ Credenciais inválidas";
            }

          } catch (err) {
            status.innerText = "❌ Erro servidor";
          }
        }
      </script>
    </body>
    </html>
  `);
});

// =======================
// LOGIN API
// =======================
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "missing_data"
      });
    }

    if (email === "admin@admin.com" && password === "123456") {
      return res.json({
        success: true,
        token: "geo-token-ok"
      });
    }

    return res.status(401).json({
      success: false,
      message: "invalid_credentials"
    });

  } catch (err) {
    console.error("[LOGIN ERROR]", err);

    return res.status(500).json({
      success: false,
      message: "internal_error"
    });
  }
});

// =======================
// HEALTH CHECK (RAILWAY SAFE)
// =======================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "geourban",
    uptime: process.uptime()
  });
});

// =======================
// SERVER START (ROBUSTO)
// =======================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("[OK] GeoUrban rodando na porta:", PORT);
  console.log("[OK] Health:", `/health`);
});

// captura erro crítico de porta
server.on("error", (err) => {
  console.error("[SERVER ERROR]", err);
});
