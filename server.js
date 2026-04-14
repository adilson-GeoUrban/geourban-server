// 🔐 LOGIN (ATIVO + PERSISTENTE)

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// 📦 carregar usuários
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({
      admin: "123456" // usuário inicial
    }));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

app.post('/login', (req, res) => {

  const { user, pass } = req.body;

  const users = loadUsers();

  // ❌ usuário não existe
  if (!users[user]) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  // ❌ senha incorreta
  if (users[user] !== pass) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  // 🔐 gera token simples
  const token = Buffer.from(user + "|" + Date.now()).toString('base64');

  console.log(`[LOGIN] ${user} entrou`);

  res.json({
    token: token,
    user: user
  });
});
