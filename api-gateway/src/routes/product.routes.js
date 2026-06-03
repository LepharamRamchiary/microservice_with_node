import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate } from "../middleware/auth.middleware.js";

dotenv.config();

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "product-service",
  });
});

router.use(
  "/",
  authenticate,
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  }),
);

export const productRoutes = router;
