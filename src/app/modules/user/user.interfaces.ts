/* eslint-disable no-unused-vars */
import { Document, Model } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: ENUM_USER_ROLE.STUDENT | ENUM_USER_ROLE.TEACHER;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export default IUser;

export type UserModel = {
  isUserExists(
    email: string,
  ): Promise<Pick<IUser, "email" | "role" | "password" | "_id"> | null>;
  comparePassword(
    enteredPassword: string,
    databasePass: string,
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: string;
  name: string;
};
