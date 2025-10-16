import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setError(data.message);
      if (res.status === 201) setPage("login");
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setError(data.message);
      if (res.ok) {
        setCurrentUser(data.user);
        setPage("todo");
        fetchTodos(data.user._id);
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername("");
    setPassword("");
    setTodos([]);
    setPage("home");
  };

  const fetchTodos = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/todos/${userId}`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (editId) {
      await fetch(`http://localhost:5000/api/todos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          completed: todos.find((t) => t._id === editId).completed,
        }),
      });
      setEditId(null);
    } else {
      await fetch(`http://localhost:5000/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, text: input }),
      });
    }
    setInput("");
    fetchTodos(currentUser._id);
  };

  const toggleComplete = async (todo) => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: todo.text, completed: !todo.completed }),
    });
    fetchTodos(currentUser._id);
  };

  const deleteTodo = async (todo) => {
    await fetch(`http://localhost:5000/api/todos/${todo._id}`, { method: "DELETE" });
    fetchTodos(currentUser._id);
  };

  const startEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo._id);
  };

  const filteredTodos = todos.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      {page === "home" && (
        <div className="home-wrapper">
          <h1>Bienvenue</h1>
          <button onClick={() => setPage("login")}>Se connecter</button>
          <button onClick={() => setPage("signup")}>Créer un compte</button>
        </div>
      )}

      {page === "login" && (
        <div className="login-wrapper">
          <h1>Connexion</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Se connecter</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p>
            Pas de compte ? <span className="link" onClick={() => setPage("signup")}>Créer un compte</span>
          </p>
          <p className="link" onClick={() => setPage("home")}>Retour</p>
        </div>
      )}

      {page === "signup" && (
        <div className="login-wrapper">
          <h1>Créer un compte</h1>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Créer un compte</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p>
            Déjà un compte ? <span className="link" onClick={() => setPage("login")}>Se connecter</span>
          </p>
          <p className="link" onClick={() => setPage("home")}>Retour</p>
        </div>
      )}

      {page === "todo" && currentUser && (
        <div className="TodoWrapper">
          <h1>My Todo List ({currentUser.username})</h1>
          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>

          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <form className="TodoForm" onSubmit={addTodo}>
            <input
              type="text"
              className="todo-input"
              placeholder="Add a task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="todo-btn" type="submit">
              {editId ? "Update" : "Add"}
            </button>
          </form>

          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div key={todo._id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <span onClick={() => toggleComplete(todo)}>{todo.text}</span>
                <div className="todo-actions">
                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
