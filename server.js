// ================= CADASTRO =================
app.post("/cadastro",
  proteger,
  autorizar(["admin", "tecnico"]),
  (req, res, next) => {

    try {

      let {
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro,
        declaracao
      } = req.body;

      // ================= USUÁRIO =================
      const usuario = req.usuario || {};

      // ================= NORMALIZAÇÃO =================
      nome = typeof nome === "string" ? nome.trim() : "";
      escolaridade = typeof escolaridade === "string" ? escolaridade.trim() : "";
      profissao = typeof profissao === "string" ? profissao.trim() : "";
      limitacoes = typeof limitacoes === "string" ? limitacoes.trim() : "";
      registro = typeof registro === "string" ? registro.trim() : "";

      // ================= VALIDAÇÃO =================
      if (!nome || !escolaridade || !profissao || !limitacoes) {
        return res.status(400).json({ erro: "Dados obrigatórios incompletos" });
      }

      // 🔒 LIMITE DE TAMANHO
      if (
        nome.length > 100 ||
        profissao.length > 100 ||
        limitacoes.length > 300 ||
        registro.length > 100
      ) {
        return res.status(400).json({ erro: "Dados excedem limite permitido" });
      }

      // 🔒 SANITIZAÇÃO MELHORADA
      const padraoSeguro = /^[a-zA-ZÀ-ÿ0-9\s.,\-_/()]+$/;

      if (
        !padraoSeguro.test(nome) ||
        !padraoSeguro.test(profissao) ||
        !padraoSeguro.test(limitacoes)
      ) {
        return res.status(400).json({ erro: "Caracteres inválidos detectados" });
      }

      // 🔒 REGRA PROFISSIONAL
      const esc = escolaridade.toLowerCase();

      if ((esc.includes("tecnico") || esc.includes("superior")) && !registro) {
        return res.status(400).json({
          erro: "Registro profissional obrigatório (ART/TRT/RRT)"
        });
      }

      // 🔒 VALIDAÇÃO EXTRA
      if (registro && registro.length < 5) {
        return res.status(400).json({ erro: "Registro inválido" });
      }

      // 🔒 DECLARAÇÃO
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

      // ================= SALVAR DIRETO (ANTI RACE CONDITION) =================
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
        function (err) {

          if (err) {

            // 🔒 TRATA DUPLICIDADE REAL (quando tiver índice UNIQUE)
            if (err.message && err.message.includes("UNIQUE")) {
              log("CADASTRO_DUPLICADO", {
                usuario: usuario.id
              });

              return res.status(409).json({
                erro: "Cadastro já existente"
              });
            }

            log("ERRO_DB", { erro: err.message });
            return next(err);
          }

          // ================= AUDITORIA =================
          log("CADASTRO", {
            status: "ok",
            usuario: usuario.id,
            perfil: usuario.nivel,
            nivelCadastro: escolaridade
          });

          return res.status(201).json({
            ok: true,
            mensagem: "Cadastro realizado com sucesso"
          });
        }
      );

    } catch (erro) {
      next(erro);
    }

  }
);
