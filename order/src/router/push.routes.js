import express from "express";
import { PushSubscription } from "../models/pushSubscription.model.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;

    await PushSubscription.create({
      subscription,
    });

    res.status(201).json({
      success: true,
      message: "Subscription saved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save subscription",
    });
  }
});

export default router;