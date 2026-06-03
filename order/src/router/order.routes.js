import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/order.controllers.js";

const router = Router();

router.route("/").post(createOrder).get(getMyOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);

export default router;
