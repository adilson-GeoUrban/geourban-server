// ================= 🔒 CORS PROFISSIONAL FINAL =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) {
      log("CORS_BLOQUEADO", { motivo: "sem_origin" });
      return callback(new Error("CORS_BLOCK"));
    }

    const originNormalizado = origin.toLowerCase();

    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    log("CORS_BLOQUEADO", { origin: originNormalizado });

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
