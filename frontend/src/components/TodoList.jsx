import TodoItem from './TodoItem'

function TodoList({ todos, fetchTodos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} fetchTodos={fetchTodos} />
      ))}
    </ul>
  )
}

export default TodoList
