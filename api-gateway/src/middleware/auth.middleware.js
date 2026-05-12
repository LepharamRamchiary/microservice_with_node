import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    // Ask the Auth Service to verify the token
    const response = await fetch(`${AUTH_SERVICE_URL}/api/v1/auth/verify`, {
      headers: { authorization: authHeader },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Forward user info to downstream services via headers
    req.headers["x-user-id"]    = data.user._id;
    req.headers["x-user-email"] = data.user.email;
    req.headers["x-user-name"]  = data.user.name;

    next();
  } catch (err) {
    return res.status(503).json({ success: false, message: "Auth service unavailable" });
  }
};