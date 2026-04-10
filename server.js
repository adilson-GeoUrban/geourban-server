// ================= 🔒 CORS PROFISSIONAL FINAL (BLINDADO) =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 aceita subdomínios controlados
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({
  origin: function (origin, callback) {

    const originNormalizado = origin ? origin.toLowerCase() : null;

    // ================= 📱 MOBILE / SEM ORIGIN =================
    if (!originNormalizado) {

      // 🔒 exige autenticação para liberar
      const auth = this?.req?.headers?.authorization;

      if (!auth) {
        log("CORS_BLOQUEADO", { motivo: "sem_origin_sem_token" });
        return callback(new Error("CORS_BLOCK"));
      }

      log("CORS_INFO", { tipo: "mobile_autenticado" });
      return callback(null, true);
    }

    // ================= ✅ WHITELIST =================
    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    // ================= ✅ SUBDOMÍNIO =================
    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    // ================= ❌ BLOQUEIO =================
    log("CORS_BLOQUEADO", { origin: originNormalizado });

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
