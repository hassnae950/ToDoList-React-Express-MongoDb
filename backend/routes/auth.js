import express from "express";
import User from "../User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ msg: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
