import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userControllers.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

// 👉 User: Get own profile
router.get("/me", authMiddleware, getProfile);

// 👉 User: Update own profile
router.put("/me", authMiddleware, updateProfile);

// 👉 Admin: Get all users
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch users ❌", error: error.message });
  }
});

// 👉 Admin: Update user role
router.patch("/:id/role", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role ❌" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found ❌" });

    res.json({ message: "✅ Role updated", user });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update role ❌", error: error.message });
  }
});

// 👉 Admin: Delete user
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    res.json({ message: "✅ User deleted" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete user ❌", error: error.message });
  }
});

export default router;
