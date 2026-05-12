import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const AUTH_SERVICE_URL    = process.env.AUTH_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ─── Auth routes (public — no JWT required) ──────────────────────────────────
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

// ─── Product routes (protected — JWT required) ───────────────────────────────
app.use(
  "/api/v1/products",
  authenticate,                          // verify token first
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", service: "api-gateway" }));

// ─── 404 fallback ────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`   → Auth Service:    ${AUTH_SERVICE_URL}`);
  console.log(`   → Product Service: ${PRODUCT_SERVICE_URL}`);
});