import express from "express";
import Todo from "../Todo.js";

const router = express.Router();

// Create Todo
router.post("/todos", async (req, res) => {
  const { title, userId } = req.body;
  try {
    const todo = new Todo({ title, userId });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get Todos
router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
