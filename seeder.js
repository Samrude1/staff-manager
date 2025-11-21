import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/retro-personnel";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Seeder Connected to MongoDB..."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Read JSON file
const employees = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/personnel.json"), "utf-8")
);

// Import Data
const importData = async () => {
  try {
    await Employee.create(employees);
    console.log("Data Imported Successfully...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Employee.deleteMany(); // Deletes all records
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Command line arg handling
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Usage: node seeder.js -i (import) | -d (delete)");
  process.exit();
}
