import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Types } from "mongoose";
import { IAssignmentUpdate } from "./assignment.interfaces";
import ApiError from "../../../errors/ApiError";
import { AssignmentService } from "./assignment.service";

// Create assignment (Teacher only)
const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const { title, description, dueDate, classId } = req.body;

  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignment = await AssignmentService.createAssignment(req.user as any, {
    title,
    description,
    dueDate,
    classId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdBy: new Types.ObjectId((req.user as any).userId),
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Assignment created successfully",
    data: assignment,
  });
});

// get assignment list for students for their class.
const getAssignmentsByClass = catchAsync(
  async (req: Request, res: Response) => {
    const { classId } = req.params;

    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const assignments = await AssignmentService.getAssignmentsByClass(
      classId,
      req.user,
    );

    res.status(httpStatus.OK).json({
      success: true,
      data: assignments,
    });
  },
);

// Get assignment by ID
const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assignment = await AssignmentService.getAssignmentById(id);

  res.status(httpStatus.OK).json({
    success: true,
    data: assignment,
  });
});

// Edit assignment (Teacher only)
const editAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: IAssignmentUpdate = req.body;

  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const updatedAssignment = await AssignmentService.updateAssignment(
    id,
    req.user,
    updateData,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Assignment updated successfully",
    data: updatedAssignment,
  });
});

export const AssignmentController = {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
  editAssignment,
};
