import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { User } from "../user/user.model";
import { AuthService } from "./auth.service";
import config from "../../../config/config";
import httpStatus from "http-status";

// const register = catchAsync(async (req: Request, res: Response) => {
//   const { name, email, password, role } = req.body;

//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.status(400).json({ message: "User already exists." });
//   }

//   const user = await AuthService.register({ name, email, password, role });

//   res.status(201).json({
//     user: {
//       userId: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });
const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const user = await AuthService.register({ name, email, password, role });

    res.status(201).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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

export const AuthController = { login, register, getMe };
