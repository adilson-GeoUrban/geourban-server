npm install express sequelize sqlite3 bcrypt jsonwebtoken
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// 🔐 config
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET = process.env.SECRET_KEY || 'geourban_master';

// 🗄️ banco (SQLite inicial)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// 👤 modelo usuário
const User = sequelize.define('User', {
  user: { type: DataTypes.STRING, unique: true },
  pass: DataTypes.STRING,
  role: DataTypes.STRING
});

// 🔄 cria banco
sequelize.sync();

// 🧪 health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔐 cadastro (admin inicial)
app.post('/register', async (req, res) => {
  const { user, pass, role } = req.body;

  const hash = await bcrypt.hash(pass, 10);

  try {
    await User.create({ user, pass: hash, role: role || 'user' });
    res.json({ message: 'Usuário criado' });
  } catch {
    res.status(400).json({ message: 'Usuário já existe' });
  }
});

// 🔐 login JWT
app.post('/login', async (req, res) => {
  const { user, pass } = req.body;

  const u = await User.findOne({ where: { user } });
  if (!u) return res.status(401).json({ message: 'Login inválido' });

  const ok = await bcrypt.compare(pass, u.pass);
  if (!ok) return res.status(401).json({ message: 'Senha inválida' });

  const token = jwt.sign(
    { id: u.id, user: u.user, role: u.role },
    SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

// 🔒 middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: 'Sem token' });

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

// 🛡️ admin only
function admin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas admin' });
  }
  next();
}

// 📊 painel admin
app.get('/admin', auth, admin, async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'user', 'role'] });
  res.json(users);
});

// 🌐 rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 🚀 start
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log('GeoUrban empresarial rodando 🚀');
});
