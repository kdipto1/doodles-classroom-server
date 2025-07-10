import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { ClassroomService } from "./classroom.service";

const createClass = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  const classroom = await ClassroomService.createClass(user, req.body);
  res.status(httpStatus.CREATED).json(classroom);
});

const joinClass = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  const classroom = await ClassroomService.joinClass(user, req.body);
  res
    .status(httpStatus.OK)
    .json({ message: "Joined class successfully", classroom });
});

const getMyClasses = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  const classes = await ClassroomService.getMyClasses(user);
  res.status(httpStatus.OK).json(classes);
});

const getClassById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const classroom = await ClassroomService.getClassById(id);
  res.status(httpStatus.OK).json(classroom);
});

export const ClassroomController = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};