import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import User from './models/User.js'
import Todo from './models/Todo.js'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error(err))

// --------- Auth Routes ---------
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: 'Champs manquants' })
  const existingUser = await User.findOne({ username })
  if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant' })
  const user = new User({ username, password })
  await user.save()
  res.status(201).json({ message: 'Inscription réussie' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (!user) return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect' })
  res.json({ message: 'Connexion réussie', user })
})

// --------- CRUD ToDo ---------
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find()
  res.json(todos)
})

app.post('/api/todos', async (req, res) => {
  const todo = new Todo({ title: req.body.title })
  await todo.save()
  res.status(201).json(todo)
})

app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, completed: req.body.completed },
    { new: true }
  )
  res.json(todo)
})

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.json({ message: 'Todo supprimé' })
})

app.listen(5000, () => console.log('Server running on http://localhost:5000'))
