import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  console.error("Error: DB_URI is not defined in .env file");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Data Base Connected Successfully");
  } catch (error) {
    console.error("Error While Connecting to the DB ", error.message);
    process.exit(1);
  }
};
