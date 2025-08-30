import { Router, Response } from "express";
import { authMiddleware, AuthRequest, isAdmin } from "../middleware/authMiddleware.js";
import { Event } from "../models/Event.js";

const router = Router();

/**
 * 📌 Create Event (Admin only)
 */
router.post("/", authMiddleware, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, price } = req.body;
    const event = new Event({ title, description, date, price });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err });
  }
});

/**
 * 📌 Get All Events (Public)
 */
router.get("/", async (_, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});

/**
 * 📌 Get Single Event (Public)
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err });
  }
});

/**
 * 📌 Update Event (Admin only)
 */
router.put("/:id", authMiddleware, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, price } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, price },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err });
  }
});

/**
 * 📌 Delete Event (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err });
  }
});

export default router;
