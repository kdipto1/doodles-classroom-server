import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { User } from "../user/user.model";
import { AuthService } from "./auth.service";
import config from "../../../config/config";
import httpStatus from "http-status";

const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const user = await AuthService.register({ name, email, password, role });

    res.status(201).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "User registered successfully",
      data: user,
    });
  },
);

const login = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.login(data);

  const { refreshToken, ...otherResults } = result;
  const cookieOptions = {
    secure: config.nodeEnv === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    success: "true",
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: otherResults,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userId } = (req as any).user;

  if (!userId) {
    res.status(200).json({
      success: "false",
      statusCode: httpStatus.OK,
      message: "Please provide id",
    });
    return;
  }
  const user = await User.findById(userId).select("-password");
  res.json(user);
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

export const AuthController = { login, register, getMe, refreshToken };
