import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/products", productRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;