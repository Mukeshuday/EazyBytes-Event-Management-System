import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-secret";

export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// ✅ Check authentication
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    req.user = decoded; // attach user payload
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token ❌" });
  }
};

// ✅ Extra middleware: restrict route to admin only
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied 🚫 Admins only" });
  }
  next();
};
