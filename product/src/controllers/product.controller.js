import mongoose from "mongoose";
import { Product } from "../model/product.model.js";

// POST /api/v1/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price == null) {
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

    return res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/products/:id
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
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
    next(error);
  }
};

// GET /api/v1/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
