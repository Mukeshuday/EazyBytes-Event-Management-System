import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware.js";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";

const router = Router();

// 👉 Create booking (with duplicate check)
router.post("/:eventId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { eventId } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID ❌" });
    }

    // check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found ❌" });

    // check if already booked
    const existingBooking = await Booking.findOne({
      user: req.user!.id, // ✅ FIXED
      event: eventId,
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event ❌" });
    }

    // create booking
    const booking = await Booking.create({
      user: req.user!.id, // ✅ FIXED
      event: eventId,
    });

    res.status(201).json({ message: "Booking successful ✅", booking });
  } catch (error: any) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Booking failed ❌", error: error.message });
  }
});

// 👉 Get all bookings for logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const bookings = await Booking.find({ user: req.user!.id }) // ✅ FIXED
      .populate("event")
      .populate("user", "name email");

    res.json(bookings);
  } catch (error: any) {
    console.error("❌ Fetch bookings error:", error);
    res.status(500).json({ message: "Fetching bookings failed ❌", error: error.message });
  }
});

// 👉 Cancel booking (DELETE)
router.delete("/:bookingId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID ❌" });
    }

    // ensure it's user's booking
    const booking = await Booking.findOne({ _id: bookingId, user: req.user!.id }); // ✅ FIXED
    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌ or not yours" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking cancelled ✅" });
  } catch (error: any) {
    console.error("❌ Cancel booking error:", error);
    res.status(500).json({ message: "Cancelling booking failed ❌", error: error.message });
  }
});

export default router;
