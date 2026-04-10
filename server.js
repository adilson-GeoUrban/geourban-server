// ================= 🔒 CORS PROFISSIONAL FINAL (SEGURO E ESTÁVEL) =================

const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 aceita subdomínios controlados
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({

  origin: function (origin, callback) {

    // ================= 📱 SEM ORIGIN (apps / backend / curl) =================
    if (!origin) {
      // 🔐 NÃO confiar aqui — validação será feita pelo JWT depois
      log("CORS_INFO", { tipo: "sem_origin_permitido" });
      return callback(null, true);
    }

    const originNormalizado = origin.toLowerCase();

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

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: true

}));
