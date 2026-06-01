import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { orderRoutes } from "./routes/order.routes.js";

// work tommorow
// Routes
app.use("/auth-api/v1", authRoutes);
app.use("/product-api/v1", productRoutes);
app.use("/order-api/v1", orderRoutes);

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