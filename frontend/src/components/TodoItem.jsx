function TodoItem({ todo, fetchTodos }) {
  const toggleComplete = async () => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    })
    fetchTodos()
  }

  const deleteTodo = async () => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, { method: 'DELETE' })
    fetchTodos()
  }

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <span onClick={toggleComplete}>{todo.title}</span>
      <button onClick={deleteTodo}>Supprimer</button>
    </li>
  )
}

export default TodoItem
