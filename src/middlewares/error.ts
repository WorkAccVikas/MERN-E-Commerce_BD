import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  console.log(err);

  if (err.name === "CastError") err.message = "Invalid ID";

  return res
    .status(err.statusCode)
    .json({ success: false, error: err.message });
};

export const TryCatch =
  (fn: ControllerType) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
