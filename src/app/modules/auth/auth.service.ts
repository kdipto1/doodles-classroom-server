import { Secret } from "jsonwebtoken";
import config from "../../../config/config";
import { ApiError } from "../../../errors";
import { JwtHelpers } from "../../../utils/jwtHelpers";
import IUser, { IUserLoginResponse } from "../user/user.interfaces";
import { User } from "../user/user.model";
import httpStatus from "http-status";

const register = async (payload: Partial<IUser>): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

const login = async (payload: Partial<IUser>): Promise<IUserLoginResponse> => {
  const { email, password } = payload;

  if (!email)
    throw new ApiError(httpStatus.BAD_REQUEST, "Email number is required");
  if (!password)
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const passwordMatch = await User.comparePassword(
    password,
    isUserExists.password,
  );
  if (!passwordMatch)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");

  const { role, _id: userId, name } = isUserExists;
  const accessToken = JwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string,
  );

  const refreshToken = JwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    role,
    name,
  };
};

export const AuthService = {
  register,
  login,
};
