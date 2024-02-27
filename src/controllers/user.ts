import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    // DESC : Custom Error
    // return next(new ErrorHandler("mere custom error", 409));
    // DESC : Custom Error [next() in catch block is mandatory here] for below 2 lines
    // throw new Error("Gadbad hai daya");
    throw new ErrorHandler("jethiya babuchak", 301);

    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  } catch (error) {
    console.log("Error", error);
    // return res.status(400).json({
    //   success: false,
    //   error: error,
    // });
    next(error);
  }
};
