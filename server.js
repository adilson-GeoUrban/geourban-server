// ================= 🔒 CORS PROFISSIONAL UNIFICADO =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 regex para proteção extra (subdomínio controlado)
const regexDominio = /^https:\/\/(www\.)?seudominio\.com$/;

app.use(cors({
  origin: function (origin, callback) {

    // 🔒 bloqueia requisição sem origem (produção)
    if (!origin) {
      log("CORS_BLOQUEADO", { motivo: "sem origin" });
      return callback(new Error("CORS_BLOCK"));
    }

    // ✅ whitelist direta
    if (ORIGENS_PERMITIDAS.includes(origin)) {
      return callback(null, true);
    }

    // ✅ validação por regex (segurança extra)
    if (regexDominio.test(origin)) {
      return callback(null, true);
    }

    // ❌ bloqueio total
    log("CORS_BLOQUEADO", { origin });

    return callback(new Error("CORS_BLOCK"));
  },

  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
