import path from "path";
import fs from "fs";
import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { NewProductRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, description, price, stock } = req.body;

    const photo = req.file;
    // console.log(`🚀 ~ photo:`, photo);

    if (!photo) return next(new ErrorHandler("Please add photo", 400));

    if (!name || !category || !price || !stock) {
      // LEARN : first remove file from uploads folder because custom error occurred
      fs.rm(photo.path, () => {
        console.log("Photo Deleted Successfully");
      });

      return next(new ErrorHandler("Please add all fields", 400));
    }

    // const normalizedPhotoPath = photo ? path.normalize(photo.path) : null;
    // console.log(`🚀 ~ normalizedPhotoPath:`, normalizedPhotoPath)

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
      // photo: normalizedPhotoPath,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5);
  return res.status(200).json({ success: true, products });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res.status(200).json({ success: true, categories });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5);
  return res.status(200).json({ success: true, products });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.status(200).json({ success: true, product });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    fs.rm(product.photo, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save({ validateBeforeSave: true });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  fs.rm(product.photo, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
