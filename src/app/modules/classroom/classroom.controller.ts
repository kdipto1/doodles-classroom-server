import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { ClassroomService } from "./classroom.service";
import { SUCCESS_MESSAGES } from "../../../constants/common";
// Import to ensure Request interface extension is loaded
import "../../../interfaces";

const createClass = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const classroom = await ClassroomService.createClass(user, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: SUCCESS_MESSAGES.CLASSROOM_CREATED,
    data: classroom,
  });
});

const joinClass = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const classroom = await ClassroomService.joinClass(user, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.CLASSROOM_JOINED,
    data: classroom,
  });
});

const getMyClasses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const classes = await ClassroomService.getMyClasses(user);

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.CLASSROOMS_RETRIEVED,
    data: classes,
  });
});

const getClassById = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const classroom = await ClassroomService.getClassById(id, user);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: SUCCESS_MESSAGES.CLASSROOM_RETRIEVED,
    data: classroom,
  });
});

export const ClassroomController = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};
