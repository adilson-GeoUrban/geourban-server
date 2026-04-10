// ================= 🔒 CORS PROFISSIONAL FINAL =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 regex para subdomínios seguros (opcional)
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({
  origin: function (origin, callback) {

    // 🔒 BLOQUEIA requisição sem origin (proteção anti-bot)
    if (!origin) {
      log("CORS_BLOQUEADO", { motivo: "sem_origin" });
      return callback(new Error("CORS_BLOCK"));
    }

    // 🔒 NORMALIZA origin (evita bypass com maiúsculas)
    const originNormalizado = origin.toLowerCase();

    // ✅ whitelist direta
    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    // ✅ validação por regex (subdomínios controlados)
    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    // ❌ BLOQUEIO TOTAL
    log("CORS_BLOQUEADO", { origin: originNormalizado });

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
