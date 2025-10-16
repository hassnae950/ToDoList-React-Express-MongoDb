// frontend/src/components/TaskItem.jsx
import React from "react";

export default function TaskItem({ task, setTasks }) {
  // Supprimer une tâche
  const deleteTask = async () => {
    try {
      await fetch(`http://localhost:5000/api/todos/${task._id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span>{task.text}</span>
      <button onClick={deleteTask} style={{ marginLeft: "10px" }}>
        Supprimer
      </button>
    </li>
  );
}
