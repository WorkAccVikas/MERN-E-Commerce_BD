import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, "Please enter coupon code"],
    },
    amount: {
      type: Number,
      required: [true, "Please enter coupon amount"],
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", schema);
