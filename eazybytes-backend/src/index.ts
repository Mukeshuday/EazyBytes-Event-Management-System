import dotenv from "dotenv";   // ✅ Load .env first
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import bookingRoutes from "./routes/bookingRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { connectDB } from "./config/db.js";

const app = express();

// 🔑 Debugging line - shows if MONGO_URI is loaded
console.log("🔑 MONGO_URI:", process.env.MONGO_URI);

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ Flexible CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser tools (like Postman)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) // ✅ allow any vercel.app preview
      ) {
        return callback(null, true);
      }
      console.warn("❌ CORS blocked request from:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", service: "easybytes-backend" });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api", testRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
