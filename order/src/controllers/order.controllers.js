import { Order } from "../models/order.model.js";
import { PushSubscription } from "../models/pushSubscription.model.js";
import webpush from "../config/webPush.js";
import mongoose from "mongoose";
import logger from "../config/logger.js";

// POST /api/v1/orders
export const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, priceAtPurchase } = req.body;

    const userId = req.headers["x-user-id"];

    if (!userId) {
      logger.warn("User not authenticated");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!productId || !quantity || !priceAtPurchase) {
      logger.warn("Product ID, quantity and price are required");
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity and price are required",
      });
    }

    const totalAmount = quantity * priceAtPurchase;

    const order = await Order.create({
      userId,
      productId,
      quantity,
      priceAtPurchase,
      totalAmount,
    });

    // Send notification to admin
    const adminSubscription = await PushSubscription.findOne();

    console.log("Admin Subscription:", adminSubscription);

    if (adminSubscription) {
      const payload = JSON.stringify({
        title: "New Order Received",
        body: `Order ${order._id} created`,
      });

      console.log("Notification Payload:", payload);

      try {
        const result = await webpush.sendNotification(
          adminSubscription.subscription,
          payload,
        );

        console.log("✅ Push notification sent successfully");
        console.log(result);
      } catch (error) {
        console.error("❌ Push Notification Error:");
        console.error(error);
      }
    } else {
      console.log("❌ No subscription found in database");
    }

    logger.info("Order created successfully");
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    logger.error("Error creating order:");
    logger.error(error);
    next(error);
  }
};

// GET /api/v1/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    logger.error("Error fetching user orders:");
    logger.error(error);
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid order ID");
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      logger.warn("Order not found");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    logger.error("Error fetching order:");
    logger.error(error);
    next(error);
  }
};

// PUT /api/v1/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      logger.warn("Invalid order status");
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      logger.warn("Order not found");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    logger.info("Order status updated successfully");
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    logger.error("Error updating order status:");
    logger.error(error);
    next(error);
  }
};
