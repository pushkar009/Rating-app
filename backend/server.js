// backend/server.js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Health check DB error:", err.message);
    res.status(500).json({ status: "db error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
