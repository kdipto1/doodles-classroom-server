import httpStatus from "http-status";
import { Types } from "mongoose";
import { UserPayload } from "../../../interfaces/user.payload";
import { IAssignment, IAssignmentUpdate } from "./assignment.interfaces";
import { Assignment } from "./assignment.model";
import { Classroom } from "../classroom/classroom.model";
import { Submission } from "../submission/submission.model";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";

const createAssignment = async (
  user: UserPayload,
  payload: IAssignment,
): Promise<IAssignment> => {
  if (user.role !== ENUM_USER_ROLE.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can create assignments",
    );
  }

  const classroom = await Classroom.findById(payload.classId);
  if (!classroom || !classroom.teacher.equals(user.userId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to create assignment for this class",
    );
  }

  const assignment = (
    await Assignment.create({
      ...payload,
      createdBy: new Types.ObjectId(user.userId),
    })
  ).toObject();

  return assignment;
};

const getAssignmentsByClass = async (classId: string, user: UserPayload) => {
  const assignments = await Assignment.find({ classId });

  const enriched = await Promise.all(
    assignments.map(async (assignment) => {
      let submission = null;

      if (user.role === ENUM_USER_ROLE.STUDENT) {
        submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: user.userId,
        }).select("submittedAt marks");
      }

      return {
        ...assignment.toObject(),
        mySubmission: submission || null,
      };
    }),
  );

  return enriched;
};

const getAssignmentById = async (id: string) => {
  const assignment = await Assignment.findById(id).populate(
    "createdBy",
    "name",
  );

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  return assignment;
};

const updateAssignment = async (
  id: string,
  user: UserPayload,
  updateData: IAssignmentUpdate,
) => {
  if (user.role !== ENUM_USER_ROLE.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only teachers can edit assignments",
    );
  }

  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  // Check if the teacher owns this assignment
  if (!assignment.createdBy.equals(user.userId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to edit this assignment",
    );
  }

  // Update the assignment
  const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("createdBy", "name");

  return updatedAssignment;
};

export const AssignmentService = {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
  updateAssignment,
};
