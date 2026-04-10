// ================= 🔒 CORS PROFISSIONAL =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

app.use(cors({
  origin: function (origin, callback) {

    // 🔒 BLOQUEIA requisições sem origem (produção)
    if (!origin) {
      log("CORS_BLOQUEADO", { motivo: "sem origin" });
      return callback(new Error("CORS_BLOCK"));
    }

    if (ORIGENS_PERMITIDAS.includes(origin)) {
      return callback(null, true);
    }

    log("CORS_BLOQUEADO", { origin });

    return callback(new Error("CORS_BLOCK"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
const regex = /^https:\/\/(www\.)?seudominio\.com$/;

if (regex.test(origin)) {
  return callback(null, true);
}
