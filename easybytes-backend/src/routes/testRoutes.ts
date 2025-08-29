import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/ping", async (req, res) => {
  try {
    // Check MongoDB connection state
    const state = mongoose.connection.readyState;

    let status = "🔴 Disconnected";
    if (state === 1) status = "🟢 Connected";
    else if (state === 2) status = "🟡 Connecting...";
    else if (state === 3) status = "🟠 Disconnecting...";

    res.json({
      message: "Pong! 🏓",
      mongoStatus: status,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error });
  }
});

export default router;
