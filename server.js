// ================= 🔒 CORS PROFISSIONAL FINAL (ÚNICO E DEFINITIVO) =================
const ORIGENS_PERMITIDAS = [
  "http://localhost:3000",
  "https://seudominio.com",
  "https://www.seudominio.com"
];

// 🔒 aceita subdomínios controlados
const regexDominio = /^https:\/\/([a-z0-9-]+\.)?seudominio\.com$/i;

app.use(cors({

  origin: function (origin, callback) {

    // 📱 SEM ORIGIN (mobile, backend, curl)
    if (!origin) {
      log("CORS_INFO", { tipo: "sem_origin_controlado" });
      return callback(null, true); // protegido pelo JWT depois
    }

    let originNormalizado;

    try {
      originNormalizado = origin.toLowerCase();
    } catch (e) {
      log("CORS_ERRO", { origin });
      return callback(new Error("CORS_BLOCK"));
    }

    // ✅ whitelist direta
    if (ORIGENS_PERMITIDAS.includes(originNormalizado)) {
      return callback(null, true);
    }

    // ✅ subdomínios
    if (regexDominio.test(originNormalizado)) {
      return callback(null, true);
    }

    // ❌ bloqueio
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

// ================= 🔐 HTTPS + REDIRECIONAMENTO =================
const https = require("https");
const http = require("http");

const options = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/fullchain.pem"),

  // 🔒 preparação para certificado A3 (mTLS futuro)
  requestCert: true,
  rejectUnauthorized: false
};

// 🚀 SERVIDOR HTTPS (OFICIAL)
https.createServer(options, app).listen(443, () => {
  log("HTTPS_START", { porta: 443 });
});

// 🔁 REDIRECIONA HTTP → HTTPS
http.createServer((req, res) => {
  res.writeHead(301, {
    Location: "https://" + req.headers.host + req.url
  });
  res.end();
}).listen(80);
