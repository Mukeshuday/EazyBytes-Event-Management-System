import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";

const router = Router();

// 👉 Create booking (with duplicate check)
router.post("/:eventId", authMiddleware, async (req: any, res) => {
  try {
    const { eventId } = req.params;

    // check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found ❌" });

    // check if already booked
    const existingBooking = await Booking.findOne({
      user: req.user.userId,
      event: eventId,
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event ❌" });
    }

    // create booking
    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
    });

    res.status(201).json({ message: "Booking successful ✅", booking });
  } catch (error: any) {
    res.status(500).json({ message: "Booking failed ❌", error: error.message });
  }
});

// 👉 Get all bookings for logged-in user
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("event")
      .populate("user", "name email");

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: "Fetching bookings failed ❌", error: error.message });
  }
});

// 👉 Cancel booking (DELETE)
router.delete("/:bookingId", authMiddleware, async (req: any, res) => {
  try {
    const { bookingId } = req.params;

    // ensure it's user's booking
    const booking = await Booking.findOne({ _id: bookingId, user: req.user.userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌ or not yours" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking cancelled ✅" });
  } catch (error: any) {
    res.status(500).json({ message: "Cancelling booking failed ❌", error: error.message });
  }
});

export default router;
