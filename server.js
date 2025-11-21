import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Increased limit for Base64 photos
app.use(cors());

// DB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/retro-personnel";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB Connected: ${MONGO_URI}`))
  .catch((err) => console.log(err));

// -- Authentication Route --
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Use environment variables or fallback to default
  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "password";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "dummy-jwt-token" });
  } else {
    res
      .status(401)
      .json({
        success: false,
        message: "The password or user name is incorrect.",
      });
  }
});

// -- Employee Routes --
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const saved = await newEmployee.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
