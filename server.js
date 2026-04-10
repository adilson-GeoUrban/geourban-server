// ================= CADASTRO =================
app.post("/cadastro", (req, res, next) => {
  try {

    const {
      nome,
      escolaridade,
      profissao,
      limitacoes,
      registro,
      declaracao
    } = req.body;

    // 🔴 VALIDAÇÃO
    if (!nome || !escolaridade || !profissao || !limitacoes) {
      return res.status(400).json({ erro: "Dados obrigatórios incompletos" });
    }

    const esc = escolaridade.toLowerCase();

    if ((esc.includes("tecnico") || esc.includes("superior")) && !registro) {
      return res.status(400).json({
        erro: "Registro profissional obrigatório (ART/TRT/RRT)"
      });
    }

    if (declaracao !== true) {
      return res.status(400).json({
        erro: "Declaração obrigatória não confirmada"
      });
    }

    // 🔐 CRIPTOGRAFIA
    const nomeCripto = CryptoJS.AES.encrypt(nome, SECRET).toString();
    const profCripto = CryptoJS.AES.encrypt(profissao, SECRET).toString();
    const limCripto = CryptoJS.AES.encrypt(limitacoes, SECRET).toString();
    const regCripto = registro
      ? CryptoJS.AES.encrypt(registro, SECRET).toString()
      : null;

    // 💾 SALVAR NO SQLITE
    db.run(
      `INSERT INTO cadastros 
      (nome, escolaridade, profissao, limitacoes, registro, data)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nomeCripto,
        escolaridade,
        profCripto,
        limCripto,
        regCripto,
        new Date().toISOString()
      ],
      (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        // 🔒 LOG SEGURO (SEM DADOS SENSÍVEIS)
        log("CADASTRO", {
          status: "ok",
          tipo: escolaridade
        });

        res.json({
          ok: true,
          mensagem: "Cadastro realizado com sucesso"
        });
      }
    );

  } catch (erro) {
    next(erro);
  }
});
