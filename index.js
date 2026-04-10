app.post("/ia", async (req, res) => {
  const { mensagem } = req.body;

  let sistema = "Você é uma IA especialista geral.";

  // 🔍 DETECÇÃO AUTOMÁTICA
  if (mensagem.includes("lei") || mensagem.includes("direito")) {
    sistema = "Você é uma IA jurídica especialista em legislação brasileira (LGPD, civil, penal).";
  }

  if (mensagem.includes("internacional")) {
    sistema = "Você é uma IA especialista em direito internacional e normas globais.";
  }

  if (mensagem.includes("imposto") || mensagem.includes("contabilidade")) {
    sistema = "Você é uma IA contábil especialista em normas brasileiras e tributação.";
  }

  if (mensagem.includes("global") || mensagem.includes("internacional contábil")) {
    sistema = "Você é uma IA contábil internacional (IFRS, compliance global).";
  }

  if (mensagem.includes("erro") || mensagem.includes("bug")) {
    sistema = "Você é uma IA engenheira de software especialista em corrigir bugs.";
  }

  if (mensagem.includes("layout") || mensagem.includes("tela")) {
    sistema = "Você é uma IA designer especialista em UX/UI e correção visual.";
  }

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sistema },
        { role: "user", content: mensagem }
      ]
    });

    res.json({ resposta: resposta.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ erro: "Falha IA" });
  }
});
