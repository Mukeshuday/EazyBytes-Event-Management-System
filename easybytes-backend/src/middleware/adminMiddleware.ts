import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

// ✅ Middleware to allow only admins
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const { role } = req.user as { id: string; email: string; role: string };

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied ❌. Admins only." });
    }

    next();
  } catch (error) {
    console.error("❌ Admin check error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
