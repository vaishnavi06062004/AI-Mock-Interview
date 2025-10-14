import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });
    const user = new User({ name, email, password: hashedPassword, verificationToken });
    await user.save();

    await sendVerificationEmail(email, verificationToken);
    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email" });

    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: "Invalid credentials" });

    // On successful login → redirect to /main
    res.redirect("/main");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
});

export default router;
