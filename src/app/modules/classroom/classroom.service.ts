import { UserPayload } from "../../../interfaces/user.payload";
import httpStatus from "http-status";
import { nanoid } from "nanoid";
import { Types } from "mongoose";

import { IClassroom } from "./classroom.interfaces";
import { Classroom } from "./classroom.model";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";

const createClass = async (
  user: UserPayload,
  payload: IClassroom,
): Promise<IClassroom> => {
  if (user.role !== ENUM_USER_ROLE.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can create classes.",
    );
  }

  const { title, subject, description } = payload;
  const code = nanoid(6).toUpperCase();

  const classroom = (
    await Classroom.create({
      title,
      subject,
      description,
      code,
      teacher: new Types.ObjectId(user.userId),
    })
  ).toObject();

  return classroom;
};

const joinClass = async (user: UserPayload, payload: { code: string }) => {
  if (user.role !== ENUM_USER_ROLE.STUDENT) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only students can join classes.");
  }

  const { code } = payload;
  const classroom = await Classroom.findOne({ code });

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found");
  }

  if (
    classroom.students.some((studentId) =>
      studentId.equals(new Types.ObjectId(user.userId)),
    )
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already joined this class");
  }

  classroom.students.push(new Types.ObjectId(user.userId));
  await classroom.save();

  return classroom;
};

const getMyClasses = async (user: UserPayload) => {
  const query =
    user.role === ENUM_USER_ROLE.TEACHER
      ? { teacher: user.userId }
      : { students: user.userId };

  const classes = await Classroom.find(query)
    .populate("teacher", "name email")
    .lean();
  return classes;
};

const getClassById = async (id: string, user: UserPayload) => {
  const classroom = await Classroom.findById(id)
    .populate("teacher", "name email")
    .populate("students", "name email");

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found");
  }

  // Check if the user is the teacher or an enrolled student
  const isTeacher = classroom.teacher._id.equals(user.userId);
  const isStudent = classroom.students.some(
    (student: { _id: Types.ObjectId }) => student._id.equals(user.userId),
  );

  if (!isTeacher && !isStudent) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this class",
    );
  }

  return classroom;
};

export const ClassroomService = {
  createClass,
  joinClass,
  getMyClasses,
  getClassById,
};
