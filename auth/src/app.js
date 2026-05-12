import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();


app.use(
  cors(),
);

//json data
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", service: "auth" }));

// 404 fallback
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// routes import
// import studentRouter from "./routers/student.router.js";

// routes declaration
// app.use("/api/v1/applicant", studentRouter);

// In app.js - update your error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err.stack || err);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };
