import { Product } from "../model/product.model.js";

// POST /api/v1/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    // API Gateway forwards the authenticated user id in this header
    const createdBy = req.headers["x-user-id"] || "unknown";

    const product = await Product.create({ name, description, price, stock, createdBy });

    return res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};