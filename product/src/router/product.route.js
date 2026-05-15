import { Router } from "express";
import {getProductById, getProducts, createProduct, deleteProduct} from "../controllers/product.controller.js";

const router = Router();

router.route("/").post(createProduct);
router.route("/").get(getProducts);
router.route("/:id").delete(deleteProduct); 
router.route("/:id").get(getProductById);

export default router;