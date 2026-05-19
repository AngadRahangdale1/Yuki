import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 

const connectDB = async () => {
  try {
    // Appends the database name to the URI connection string
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB Connected successfully!");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;