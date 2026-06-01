import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controllers.js";

const router = Router();

router.route("/").post(createOrder).get(getMyOrders);

export default router;
