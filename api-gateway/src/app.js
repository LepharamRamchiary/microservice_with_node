import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";


// Routes
app.use("/auth-api/v1", authRoutes);
app.use("/product-api/v1", productRoutes);

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