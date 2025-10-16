// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

// routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// ===== Route test =====
app.get("/api/test", (req, res) => {
  console.log("Route test appelée !");
  res.send("Hello from backend!");
});

// ===== Autres routes pour l'application TODO =====
// ici on ajoutera signup, login, todos ...

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
