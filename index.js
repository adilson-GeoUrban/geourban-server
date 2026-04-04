const express = require("express");
const path = require("path");

const app = express();

const OpenAI = require("openai");
const Stripe = require("stripe");

// 🔐 ENV
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
📦 MIDDLEWARE
*/
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
🔥 ROTA PRINCIPAL (CORREÇÃO DO RENDER)
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
🧠 IA GEOURBAN
*/
app.post("/consultoria", async (req, res) => {
  const { texto } = req.body;

  if (!texto) return res.status(400).json({ error: "Texto vazio" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Responda SOMENTE JSON válido:

{
  "tipo": "juridico | tecnico | operacional | geral",
  "diagnostico": "texto profissional",
  "sugestoes": ["acao 1", "acao 2", "acao 3"],
  "valor_estimado": 0,
  "risco": "baixo | medio | alto"
}
`
        },
        { role: "user", content: texto }
      ],
      temperature: 0.3
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json/g, "").replace(/```/g, "");

    try {
      return res.json(JSON.parse(content));
    } catch {
      return res.status(500).json({
        error: "IA retornou JSON inválido",
        raw: content
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Falha IA",
      detalhe: err.message
    });
  }
});

/**
💳 STRIPE CHECKOUT
*/
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { valor = 97, descricao = "Consulta GeoUrban" } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: descricao },
            unit_amount: valor * 100
          },
          quantity: 1
        }
      ],
      success_url: "https://seu-dominio.com/sucesso",
      cancel_url: "https://seu-dominio.com/cancelado"
    });

    return res.json({ url: session.url });

  } catch (err) {
    return res.status(500).json({
      error: "Stripe error",
      detalhe: err.message
    });
  }
});

/**
🚀 START SERVER
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("GEOURBAN ONLINE 🚀 PORT:", PORT);
});
