import { Request, Response } from "express";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// ✅ GET /api/users/me (fetch profile)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    // req.user contains decoded JWT (we set { id, email, role } inside)
    const { id } = req.user as { id: string; email: string; role: string };

    const user = await User.findById(id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
