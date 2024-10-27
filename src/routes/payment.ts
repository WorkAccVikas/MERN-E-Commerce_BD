import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  applyDiscount,
  newCoupon,
  deleteCoupon,
  allCoupons,
} from "../controllers/payment.js";

const app = express.Router();

// route - /api/v1/payment/discount
app.route("/discount").get(applyDiscount);

// route - /api/v1/payment/coupon/new
app.route("/coupon/new").post(adminOnly, newCoupon);

// route - /api/v1/payment/coupon/all
app.route("/coupon/all").get(adminOnly, allCoupons);

// route - /api/v1/payment/coupon/:id
app.route("/coupon/:id").delete(adminOnly, deleteCoupon);

export default app;
