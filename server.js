app.post("/login", (req, res) => {
  const { comando } = req.body;

  if (comando === "login") {
    return res.json({
      mensagem: "Login executado",
      acao: "REDIRECT",
      destino: "/dashboard.html"
    });
  }

  res.json({ mensagem: "Comando inválido" });
});
