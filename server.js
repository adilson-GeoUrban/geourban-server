// ================= 🔒 CORS PROFISSIONAL FINAL (APP + WEB) =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 aceita subdomínios controlados
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({
  origin: function (origin, callback) {

    // 📱 PERMITE APP MOBILE (sem origin)
    if (!origin) {
      log("CORS_INFO", { tipo: "mobile_app_sem_origin" });
      return callback(null, true);
    }

    const originNormalizado = origin.toLowerCase();

    // ✅ whitelist direta
    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    // ✅ subdomínio seguro
    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    // ❌ bloqueio
    log("CORS_BLOQUEADO", { origin: originNormalizado });

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
