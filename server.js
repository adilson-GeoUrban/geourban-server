// 🔐 proteção primeiro
function protegerMaster(req, res, next) {
  const chave = req.headers["x-api-key"];

  if (!chave || chave !== process.env.GEOURBAN_MASTER_KEY) {
    return res.status(403).json({ erro: "Acesso negado 🔒" });
  }

  next();
}

// 🔒 aplica proteção
app.use("/api", protegerMaster);

// ✅ DEPOIS cria as rotas
app.get("/api/teste", (req, res) => {
  res.json({ status: "OK 🔓 servidor funcionando" });
});
