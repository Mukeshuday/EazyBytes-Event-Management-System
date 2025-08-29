import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware.js";
import { Event } from "../models/Event.js";

const router = Router();

// 📌 Create an Event (Admin/Organizer feature - for now anyone can)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, price } = req.body;
    const event = new Event({ title, description, date, price });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err });
  }
});

// 📌 Get All Events
router.get("/", async (_, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});

// 📌 Get Single Event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err });
  }
});

// 📌 Update Event
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
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

// 📌 Delete Event
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err });
  }
});

export default router;
