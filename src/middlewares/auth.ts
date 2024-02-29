import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please provide ID", 400)); // Bad Request

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404)); // Not Found

  if (user.role !== "admin") return next(new ErrorHandler("UnAuthorized", 403)); // Forbidden

  next();
});
