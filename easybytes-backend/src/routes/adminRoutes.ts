// src/routes/adminRoutes.ts
import { Router } from "express";
import { isAdmin, authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { Event } from "../models/Event.js";
import { Booking } from "../models/Booking.js";

const router = Router();

// 👉 Admin dashboard stats
router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const eventsCount = await Event.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    res.json({ usersCount, eventsCount, bookingsCount });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch stats ❌", error: error.message });
  }
});

export default router;
