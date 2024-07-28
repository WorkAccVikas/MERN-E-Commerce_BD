import path from "path";
import fs from "fs";
import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import {
  NewProductRequestBody,
  SearchRequestQuery,
  BaseQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

// Revalidate on New,Update,Delete Product & on New Order
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products") as string);
  } else {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);

    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({ success: true, products });
});

// Revalidate on New,Update,Delete Product & on New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");

    myCache.set("categories", JSON.stringify(categories));
  }
  return res.status(200).json({ success: true, categories });
});

// Revalidate on New,Update,Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("all-products") as string);
  } else {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
    myCache.set("all-products", JSON.stringify(products));
  }
  return res.status(200).json({ success: true, products });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const { id } = req.params;
  const key = `product-${id}`;

  if (myCache.get(key)) {
    product = JSON.parse(myCache.get(key) as string);
  } else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    myCache.set(key, JSON.stringify(product));
  }

  return res.status(200).json({ success: true, product });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    // NOTE : 3rd parameter in req is for body
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

    await invalidateCache({
      product: true,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

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
  await invalidateCache({
    product: true,
    productId: String(product._id),
  });

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

  await invalidateCache({
    product: true,
    productId: String(product._id),
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    // NOTE : 4th parameter in req is for query

    const { search, category, sort, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 5;
    const skip = limit * (page - 1);

    let baseQuery: BaseQuery = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const [productsFetched, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const products = productsFetched;

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\channels4_profile-171993880284369388.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ success: true });
// };

// generateRandomProducts(400);

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };
