import { Router } from "express";
import { register, login, verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify").get(verifyToken);

export default router;