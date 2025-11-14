// backend/server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// ------------------ TEST ROUTE ------------------
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// ------------------ START SERVER ------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
