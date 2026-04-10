// ================= CADASTRO =================
app.post("/cadastro", (req, res, next) => {
  try {

    let {
      nome,
      escolaridade,
      profissao,
      limitacoes,
      registro,
      declaracao
    } = req.body;

    // ================= NORMALIZAÇÃO =================
    nome = nome?.trim();
    escolaridade = escolaridade?.trim();
    profissao = profissao?.trim();
    limitacoes = limitacoes?.trim();
    registro = registro?.trim();

    // ================= VALIDAÇÃO =================
    if (!nome || !escolaridade || !profissao || !limitacoes) {
      return res.status(400).json({
        erro: "Dados obrigatórios incompletos"
      });
    }

    // 🔒 LIMITE DE TAMANHO (ANTI ATAQUE)
    if (nome.length > 100 || profissao.length > 100) {
      return res.status(400).json({
        erro: "Dados muito longos"
      });
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

    // ================= CRIPTOGRAFIA =================
    const nomeCripto = CryptoJS.AES.encrypt(nome, SECRET).toString();
    const profCripto = CryptoJS.AES.encrypt(profissao, SECRET).toString();
    const limCripto = CryptoJS.AES.encrypt(limitacoes, SECRET).toString();
    const regCripto = registro
      ? CryptoJS.AES.encrypt(registro, SECRET).toString()
      : null;

    // ================= SALVAR =================
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

        // 🔒 LOG SEGURO
        log("CADASTRO", {
          status: "ok"
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
app.post("/cadastro", proteger, (req, res, next) => {
