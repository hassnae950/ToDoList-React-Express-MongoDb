import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Créer une tâche
router.post("/", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const newTodo = new Todo({ userId, text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Lire toutes les tâches d’un utilisateur
router.get("/:userId", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Mettre à jour une tâche
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Supprimer une tâche
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
