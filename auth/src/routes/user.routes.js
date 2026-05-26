import { Router } from "express";
import {
  register,
  login,
  verifyToken,
  getMyProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register-user").post(register);
router.route("/login").post(login);
router.route("/verify").get(verifyToken);

// protected route
router.route("/me").get(authenticate, getMyProfile);
router.route("/logout").post(authenticate, logout);

export default router;
