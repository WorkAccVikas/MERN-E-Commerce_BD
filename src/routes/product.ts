import { upload } from "./../middlewares/multer.js";
import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
    deleteProduct,
  getAdminProducts,
  getAllCategories,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.js";

const app = express.Router();

// To Create New Product :  /api/v1/product/new
app.route("/new").post(adminOnly, upload.single("photo"), newProduct);

// To get last 5 Products : /api/v1/product/latest
app.route("/latest").get(getLatestProducts);

// To get all unique Categories  - /api/v1/product/categories
app.route("/categories").get(getAllCategories);

//To get all Products   - /api/v1/product/admin-products
app.route("/admin-products").get(adminOnly, getAdminProducts);

// To get, update, delete Product
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, upload.single("photo"), updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
