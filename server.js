// ================= 🔒 CORS PROFISSIONAL FINAL (PADRÃO ÚNICO) =================

const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 aceita subdomínios controlados
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({

  origin: function (origin, callback) {

    // ================= 📱 SEM ORIGIN (mobile, curl, backend) =================
    if (!origin) {
      log("CORS_INFO", { tipo: "sem_origin_controlado" });
      return callback(null, true); // JWT vai proteger depois
    }

    // 🔒 normalização segura
    let originNormalizado;
    try {
      originNormalizado = origin.toLowerCase();
    } catch (e) {
      log("CORS_ERRO", { origin });
      return callback(new Error("CORS_BLOCK"));
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

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: true

}));
