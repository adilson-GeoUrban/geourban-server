// 🧾 LOG DE ACESSO + SEGURANÇA UNIFICADO (VERSÃO HARDENED)

app.set('trust proxy', true);

app.use((req, res, next) => {

  // 🔍 IP REAL (proxy seguro)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;

  const path = req.originalUrl;
  const method = req.method;
  const time = new Date().toISOString();

  // 📊 LOG DE ENTRADA
  console.log(`[LOG] ${time} | ${method} | ${path} | IP: ${ip}`);

  // ✅ LIBERA FRONTEND
  if (
    req.path === '/' ||
    req.path.startsWith('/login') ||
    req.path.startsWith('/admin-access') ||
    req.path.endsWith('.html') ||
    req.path.endsWith('.js') ||
    req.path.endsWith('.css') ||
    req.path.startsWith('/public')
  ) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers['authorization'];

  // 🔒 BLOQUEIO API KEY
  if (!apiKey || apiKey !== process.env.API_KEY) {
    console.warn(`[BLOCKED] API_KEY inválida | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }

  // 🔒 BLOQUEIO TOKEN AUSENTE
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(`[BLOCKED] Token ausente/mal formatado | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user, timestamp] = decoded.split("|");

    const expirado = (Date.now() - parseInt(timestamp)) > (2 * 60 * 60 * 1000);

    if (!user || !timestamp || expirado) {
      console.warn(`[BLOCKED] Token inválido/expirado | IP: ${ip}`);
      return res.status(404).json({ error: "Not Found" });
    }

    // ✅ LOG DE SUCESSO (AUDITORIA)
    console.log(`[AUTH OK] ${user} | IP: ${ip}`);

    next();

  } catch (err) {
    console.warn(`[BLOCKED] Token corrompido | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }
});
