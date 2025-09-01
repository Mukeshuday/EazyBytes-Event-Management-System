import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { IEvent } from "../models/Event.js"; // 👈 import Event interface

const router = Router();

router.post("/:bookingId/pay", authMiddleware, async (req: any, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.userId,
    }).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }

    // ✅ Typecast event so TS knows it has "price"
    const event = booking.event as unknown as IEvent;
    const amount = event.price;

    const payment = await Payment.create({
      user: req.user.userId,
      booking: bookingId,
      amount,
      status: "success",
    });

    res.json({ message: "✅ Payment successful", payment });
  } catch (error: any) {
    res.status(500).json({ message: "Payment failed ❌", error: error.message });
  }
});

export default router;
