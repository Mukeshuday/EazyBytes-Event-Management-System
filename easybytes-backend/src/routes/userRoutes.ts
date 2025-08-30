import { Router } from "express";
import { getProfile } from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// ✅ Protected route
router.get("/me", authMiddleware, getProfile);

export default router;
