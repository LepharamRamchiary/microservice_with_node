import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

// POST /api/v1/orders
export const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, priceAtPurchase } = req.body;

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!productId || !quantity || !priceAtPurchase) {
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

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
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
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
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
    next(error);
  }
};
