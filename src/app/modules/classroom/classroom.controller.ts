import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { ClassroomService } from "./classroom.service";
import ApiError from "../../../errors/ApiError";

const createClass = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const classroom = await ClassroomService.createClass(req.user, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Class created successfully",
    data: classroom,
  });
});

const joinClass = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const classroom = await ClassroomService.joinClass(req.user, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Joined class successfully",
    data: classroom,
  });
});

const getMyClasses = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const classes = await ClassroomService.getMyClasses(req.user);
  res.status(httpStatus.OK).json({
    success: true,
    data: classes,
  });
});

const getClassById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const { id } = req.params;
  const classroom = await ClassroomService.getClassById(id, req.user);
  res.status(httpStatus.OK).json({
    success: true,
    data: classroom,
  });
});

export const ClassroomController = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};
