import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";


export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const userId = localStorage.getItem("userId");

  // Charger les tâches
  useEffect(() => {
    fetch(`http://localhost:5000/api/todos/${userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => alert("Erreur de chargement"));
  }, [userId]);

  // Ajouter une tâche
  const addTask = async () => {
    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text }),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setText("");
  };

  return (
    <div>
      <h2>Mes Tâches</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button onClick={addTask}>Ajouter</button>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} setTasks={setTasks} />
        ))}
      </ul>
    </div>
  );
}
