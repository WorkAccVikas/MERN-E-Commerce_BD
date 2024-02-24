import mongoose from "mongoose";
import validator from "validator";

const roleEnum = ["admin", "user"] as const;
type TRole = (typeof roleEnum)[number];

const genderEnum = ["male", "female"] as const;
type TGender = (typeof genderEnum)[number];

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  //   role: "admin" | "user";
  role: TRole;
  //   gender: "male" | "female";
  gender: TGender;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual Attribute
  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please enter Email"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      //   enum: ["admin", "user"],
      enum: roleEnum,
      default: "user",
    },
    gender: {
      type: String,
      //   enum: ["male", "female"],
      enum: genderEnum,
      required: [true, "Please enter Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of birth"],
    },
  },
  { timestamps: true }
);

// LEARN : Add virtual key
schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  /** DESC: E.g :
   *  today : 24-02-2024
   *  dob : 13-03-1997
   */
  let age = today.getFullYear() - dob.getFullYear(); // 2024 - 1997 = 27
  const monthDiff = today.getMonth() - dob.getMonth();

  /** DESC : If the birthday hasn't occurred yet this year, subtract one year
   * 1. dob month is greater than today month
   * 2. dob month is same as today month but dob date is greater than today date
   * */
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
});

export const User = mongoose.model<IUser>("User", schema);
