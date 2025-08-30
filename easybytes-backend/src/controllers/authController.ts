import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-secret"; // fallback if env missing

// ✅ Helper to generate JWT
function generateToken(user: IUser) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // 👈 include role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// 👉 Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // 👈 default role
    });

    // generate JWT
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully ✅",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Signup failed ❌", error: error.message });
  }
};

// 👉 Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // generate JWT
    const token = generateToken(user);

    res.json({
      message: "Login successful ✅",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed ❌", error: error.message });
  }
};
