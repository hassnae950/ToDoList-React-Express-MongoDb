import { useState, useEffect } from 'react'

function TodoPage() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:5000/api/todos')
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!title) return
    if (editId) {
      await fetch(`http://localhost:5000/api/todos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: todos.find(t => t._id === editId).completed })
      })
      setEditId(null)
    } else {
      await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
    }
    setTitle('')
    fetchTodos()
  }

  const toggleComplete = async (todo) => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    })
    fetchTodos()
  }

  const deleteTodo = async (todo) => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, { method: 'DELETE' })
    fetchTodos()
  }

  const startEdit = (todo) => {
    setTitle(todo.title)
    setEditId(todo._id)
  }

  const filteredTodos = todos.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <input
        type="text"
        placeholder="Recherche..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nouvelle tâche"
          style={{ flex: 1, padding: '10px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc' }}
        />
        <button onClick={addTodo} style={{ padding: '10px', cursor: 'pointer' }}>
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px',
              borderBottom: '1px solid #ddd',
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            <span style={{ cursor: 'pointer', flex: 1 }} onClick={() => toggleComplete(todo)}>
              {todo.title}
            </span>
            <button onClick={() => startEdit(todo)} style={{ marginRight: '5px' }}>Edit</button>
            <button onClick={() => deleteTodo(todo)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoPage
