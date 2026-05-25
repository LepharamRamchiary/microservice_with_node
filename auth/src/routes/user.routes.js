import { Router } from "express";
import {
  register,
  login,
  verifyToken,
  getMyProfile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../../../api-gateway/src/middleware/auth.middleware.js";

const router = Router();

router.route("/register-user").post(register);
router.route("/login").post(login);
router.route("/verify").get(verifyToken);

// protected route
router.route("/me").get(authenticate, getMyProfile);

export default router;
