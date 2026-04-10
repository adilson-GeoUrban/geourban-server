const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

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
