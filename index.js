// ================= IA - MÓDULOS =================

// 🔹 IA JURÍDICA
function iaJuridica(msg) {
  if (msg.includes("lei") || msg.includes("contrato")) {
    return "⚖️ IA Jurídica: verificar legislação e documentação.";
  }
  return null;
}

// 🔹 IA CONTÁBIL
function iaContabil(msg) {
  if (msg.includes("imposto")) {
    return "📊 IA Contábil: avaliar regime tributário.";
  }
  return null;
}

// 🔹 IA TÉCNICA
function iaTecnica(msg) {
  if (msg.includes("erro") || msg.includes("bug")) {
    return "🛠 IA Técnica: verificar sistema.";
  }

  if (msg.includes("tela")) {
    return "🎨 IA Designer: ajustar layout.";
  }

  return null;
}

// ================= IA GLOBAL (CÉREBRO) =================
app.post("/ia", (req, res, next) => {
  try {

    const mensagemOriginal = req.body.mensagem || "";

    if (!mensagemOriginal) {
      return res.json({ resposta: "Digite uma mensagem." });
    }

    const mensagem = mensagemOriginal.toLowerCase();

    // 🔒 BLOQUEIO LEGAL
    const proibidos = ["ilegal", "fraude", "sonegar", "burlar"];

    for (let p of proibidos) {
      if (mensagem.includes(p)) {
        log("BLOQUEIO", { mensagem: mensagemOriginal });

        return res.json({
          resposta: "🚫 IA Jurídica: operação bloqueada."
        });
      }
    }

    // 🧠 ROTEAMENTO INTELIGENTE
    let resposta =
      iaJuridica(mensagem) ||
      iaContabil(mensagem) ||
      iaTecnica(mensagem) ||
      "🤖 IA GeoUrban: análise não classificada.";

    // 🔐 CRIPTOGRAFIA
    const criptografado = CryptoJS.AES.encrypt(mensagemOriginal, SECRET).toString();

    // 💾 SALVAR + LOG
    db.run(
      "INSERT INTO operacoes (mensagem, data) VALUES (?, ?)",
      [criptografado, new Date().toISOString()],
      (err) => {
        if (err) {
          log("ERRO_DB", { erro: err.message });
          return next(err);
        }

        log("IA", {
          entrada: mensagemOriginal,
          resposta
        });

        res.json({ resposta });
      }
    );

  } catch (erro) {
    next(erro);
  }
});
