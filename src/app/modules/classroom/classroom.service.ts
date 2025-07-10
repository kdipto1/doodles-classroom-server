import httpStatus from "http-status";
import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { ApiError } from "../../../errors";
import { IClassroom } from "./classroom.interfaces";
import { Classroom } from "./classroom.model";

const createClass = async (
  user: any,
  payload: IClassroom,
): Promise<IClassroom> => {
  if (user.role !== "teacher") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can create classes.",
    );
  }

  const { title, subject, description } = payload;
  const code = nanoid(6).toUpperCase();

  const classroom = (await Classroom.create({
    title,
    subject,
    description,
    code,
    teacher: new Types.ObjectId(user.userId),
  })).toObject();

  return classroom;
};

const joinClass = async (user: any, payload: { code: string }) => {
  if (user.role !== "student") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only students can join classes.",
    );
  }

  const { code } = payload;
  const classroom = await Classroom.findOne({ code });

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found");
  }

  if (classroom.students.includes(user.userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already joined this class");
  }

  classroom.students.push(new Types.ObjectId(user.userId));
  await classroom.save();

  return classroom;
};

const getMyClasses = async (user: any) => {
  const query =
    user.role === "teacher"
      ? { teacher: user.userId }
      : { students: user.userId };

  const classes = await Classroom.find(query)
    .populate("teacher", "name email")
    .lean();
  return classes;
};

const getClassById = async (id: string) => {
  const classroom = await Classroom.findById(id)
    .populate("teacher", "name email")
    .populate("students", "name email")
    .lean();

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found");
  }

  return classroom;
};

export const ClassroomService = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};
