import { Request, Response } from "express";
import httpStatus from "http-status";
import { nanoid } from "nanoid";
import catchAsync from "../../../utils/catchAsync";
import { Classroom } from "./classroom.model";

const createClass = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  if (user.role !== "teacher") {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Only teachers can create classes." });
    return;
  }

  const { title, subject, description } = req.body;
  const code = nanoid(6).toUpperCase();

  const classroom = await Classroom.create({
    title,
    subject,
    description,
    code,
    teacher: user.userId,
  });

  res.status(httpStatus.CREATED).json(classroom);
});

const joinClass = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  console.log(user);
  console.log(req.body);
  if (user.role !== "student") {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Only students can join classes." });
    return;
  }

  const { code } = req.body;
  const classroom = await Classroom.findOne({ code });

  if (!classroom) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Class not found" });
    return;
  }

  if (classroom.students.includes(user.userId)) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "You already joined this class" });
    return;
  }

  classroom.students.push(user.userId);
  await classroom.save();

  res
    .status(httpStatus.OK)
    .json({ message: "Joined class successfully", classroom });
});

const getMyClasses = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  console.log(user);
  const query =
    user.role === "teacher"
      ? { teacher: user.userId }
      : { students: user.userId };

  const classes = await Classroom.find(query).populate("teacher", "name email");
  res.status(httpStatus.OK).json(classes);
});

const getClassById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const classroom = await Classroom.findById(id)
    .populate("teacher", "name email")
    .populate("students", "name email");

  if (!classroom) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Class not found" });
    return;
  }

  res.status(httpStatus.OK).json(classroom);
});

export const ClassroomController = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};
