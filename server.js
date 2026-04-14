// 🔐 BASE ÚNICA (NÃO DUPLICAR EM OUTRO LUGAR)
if (!global.users) {
  global.users = {
    admin: "123456"
  };
}

// 🔐 LOGIN
app.post('/login', (req, res) => {
  const { user, pass } = req.body;

  if (!global.users[user]) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  if (global.users[user] !== pass) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  const token = Buffer.from(user + "|" + Date.now()).toString('base64');

  res.json({ token, user });
});

// 🔐 ALTERAR SENHA
app.post('/change-password', (req, res) => {
  const token = req.headers['authorization'];
  const { currentPass, newPass } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [user] = decoded.split("|");

    const storedPass = global.users[user];

    if (!storedPass) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (storedPass !== currentPass) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    if (!newPass || newPass.length < 6) {
      return res.status(400).json({ message: "Nova senha muito fraca" });
    }

    global.users[user] = newPass;

    res.json({ message: "Senha alterada com sucesso" });

  } catch {
    res.status(500).json({ message: "Erro interno" });
  }
});
