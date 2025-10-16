const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Modèle utilisateur
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Modèle todo
const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Champs manquants' });

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

  const user = await User.create({ username, password });
  res.status(201).json({ user, message: 'Inscription réussie' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });

  res.json({ user, message: 'Connexion réussie' });
});

// Get todos pour un utilisateur
app.get('/api/todos/:userId', async (req, res) => {
  const todos = await Todo.find({ userId: req.params.userId });
  res.json(todos);
});

// Ajouter todo
app.post('/api/todos', async (req, res) => {
  const { userId, text } = req.body;
  const todo = await Todo.create({ userId, text });
  res.json(todo);
});

// Modifier todo
app.put('/api/todos/:id', async (req, res) => {
  const { text, completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(req.params.id, { text, completed }, { new: true });
  res.json(todo);
});

// Supprimer todo
app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo supprimé' });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
