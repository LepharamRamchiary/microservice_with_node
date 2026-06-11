import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import logger from "../config/logger.js";

// POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      logger.warn("Registration attempt with missing fields", {
        ip: req.ip,
        body: req.body,
        email: email,
      });

      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Registration attempt with already registered email", {
        ip: req.ip,
        email: email,
      });

      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    logger.info("New user registered", {
      ip: req.ip,
      userId: user._id,
      email: user.email,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    logger.info("User logged in", {
      ip: req.ip,
      userId: user._id,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/verify  — used internally by API Gateway
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    logger.error("Failed to fetch profile", {
      ip: req.ip,
      userId: req.user._id,
    });
    return res
      .status(401)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    logger.error("Failed to logout", {
      ip: req.ip,
      userId: req.user._id,
    });
    return res
      .status(500)
      .json({ success: false, message: "Failed to logout" });
  }
};
