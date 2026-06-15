import mongoose from "mongoose";
import { Product } from "../model/product.model.js";
import logger from "../config/logger.js";

// POST /api/v1/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price == null) {
      logger.warn("Name and price are required");
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const productData = {
      name,
      description,
      price,
      stock,
      createdBy: req.headers["x-user-id"] || "unknown",
    };

    const product = await Product.create(productData);

    logger.info("Product created successfully");
    return res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    logger.error("Error creating product:");
    logger.error(error);
    next(error);
  }
};

// PUT /api/v1/products/:id
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid product ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const { name, description, price, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // if product not found
    if (!updatedProduct) {
      logger.warn("Product not found");
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    logger.error("Error updating product:");
    logger.error(error);
    next(error);
  }
};

// GET /api/v1/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    logger.info("Products fetched successfully");
    return res
      .status(200)
      .json({ success: true, count: products.length, products });
  } catch (err) {
    logger.error("Error fetching products:");
    logger.error(err);
    next(err);
  }
};

// GET /api/v1/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn("Product not found");
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    logger.info("Product fetched successfully");
    return res.status(200).json({ success: true, product });
  } catch (err) {
    logger.error("Error fetching product:");
    logger.error(err);
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid product ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      logger.warn("Product not found");
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    logger.info("Product deleted successfully");
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    logger.error("Error deleting product:");
    logger.error(error);
    next(error);
  }
};
