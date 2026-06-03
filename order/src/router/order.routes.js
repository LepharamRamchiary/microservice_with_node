import { Router } from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/order.controllers.js";

const router = Router();

router.route("/").post(createOrder).get(getMyOrders);
router.route("/:id").get(getOrderById);

export default router;
