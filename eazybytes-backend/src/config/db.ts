import mongoose from "mongoose";

export async function connectDB() {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
