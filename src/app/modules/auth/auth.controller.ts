import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { User } from "../user/user.model";
import { AuthService } from "./auth.service";
import config from "../../../config/config";
import httpStatus from "http-status";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants/common";
// Import to ensure Request interface extension is loaded
import "../../../interfaces";

const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
      });
      return;
    }

    const user = await AuthService.register({ name, email, password, role });

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
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
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.USER_LOGGED_IN,
    data: otherResults,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: ERROR_MESSAGES.USER_ID_NOT_FOUND,
    });
    return;
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: ERROR_MESSAGES.USER_NOT_FOUND,
    });
    return;
  }
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.USER_PROFILE_RETRIEVED,
    data: user,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
    data: result,
  });
});

export const AuthController = { login, register, getMe, refreshToken };
