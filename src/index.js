import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

// Load env variables first thing
dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

