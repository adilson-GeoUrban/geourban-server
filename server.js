const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER && password === PASS) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});
const USER = process.env.USER_LOGIN;
const PASS = process.env.ADMIN_PASS;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
git add .
git commit -m "fix: configura CORS, JSON e rota de login no backend"
git push
// 🔐 ALTERAR SENHA (PROTEGIDO)
app.post('/change-password', (req, res) => {
  const token = req.headers['authorization'];
  const { currentPass, newPass } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user] = decoded.split("|");

    if (!user) {
      return res.status(401).json({ message: "Token inválido" });
    }

    if (!global.users) global.users = {};

    const storedPass = global.users[user];

    if (!storedPass) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (storedPass !== currentPass) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    if (currentPass === newPass) {
      return res.status(400).json({ message: "Nova senha não pode ser igual à atual" });
    }

    if (!newPass || newPass.length < 6) {
      return res.status(400).json({ message: "Nova senha muito fraca" });
    }

    global.users[user] = newPass;

    console.log(`[SECURITY] ${user} alterou senha em ${new Date().toISOString()}`);

    res.json({ message: "Senha alterada com sucesso" });

  } catch (err) {
    console.error("[ERRO CHANGE PASSWORD]", err);
    res.status(500).json({ message: "Erro interno" });
  }
});
app.get('/', (req, res) => {
  res.send('GeoUrban Server Online 🚀');
});
npm install cors
