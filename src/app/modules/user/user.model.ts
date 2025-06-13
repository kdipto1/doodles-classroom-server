import mongoose, { model } from "mongoose";
import bcrypt from "bcryptjs";
import IUser, { UserModel } from "./user.interfaces";

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
  },
  { timestamps: true },
);

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparing password
userSchema.statics.comparePassword = async function (
  enteredPassword: string,
  databasePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, databasePassword);
};

userSchema.statics.isUserExists = async function (
  email: string,
): Promise<Pick<IUser, "email" | "role" | "password" | "_id"> | null> {
  return await User.findOne(
    { email: email },
    { _id: 1, password: 1, email: 1, role: 1 },
  );
};

export const User = model<IUser, UserModel>("User", userSchema);
