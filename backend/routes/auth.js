import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ msg: "Username already exists" });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
