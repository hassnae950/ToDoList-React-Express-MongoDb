import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import TodoPage from './components/TodoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/todos" element={<TodoPage />} />
    </Routes>
  )
}

export default App
