// 🧾 LOG DE ACESSO + SEGURANÇA UNIFICADO
app.use((req, res, next) => {

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
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
  const token = req.headers['authorization'];

  // 🔒 BLOQUEIO API KEY
  if (!apiKey || apiKey !== process.env.API_KEY) {
    console.warn(`[BLOCKED] API_KEY inválida | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }

  // 🔒 BLOQUEIO TOKEN AUSENTE
  if (!token) {
    console.warn(`[BLOCKED] Token ausente | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user, timestamp] = decoded.split("|");

    const expirado = (Date.now() - parseInt(timestamp)) > (2 * 60 * 60 * 1000);

    if (!user || expirado) {
      console.warn(`[BLOCKED] Token inválido/expirado | IP: ${ip}`);
      return res.status(404).json({ error: "Not Found" });
    }

    next();

  } catch {
    console.warn(`[BLOCKED] Token corrompido | IP: ${ip}`);
    return res.status(404).json({ error: "Not Found" });
  }
});
