import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Assignment } from "./assignment.model";
import { Classroom } from "../classroom/classroom.model";
import { Submission } from "../submission/submission.model";

// Create assignment (Teacher only)
const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const { title, description, dueDate, classId } = req.body;

  // @ts-ignore
  const user = (req as any).user;

  if (user.role !== "teacher") {
    res.status(httpStatus.FORBIDDEN).json({
      message: "Only teachers can create assignments",
    });
    return;
  }

  const classroom = await Classroom.findById(classId);
  if (!classroom || !classroom.teacher.equals(user.userId)) {
    res.status(httpStatus.FORBIDDEN).json({
      message: "Unauthorized to create assignment for this class",
    });
    return;
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    classId,
    createdBy: user.userId,
  });

  res.status(httpStatus.CREATED).json(assignment);
});

// Get assignments by class ID
// const getAssignmentsByClass = catchAsync(
//   async (req: Request, res: Response) => {
//     const { classId } = req.params;

//     const assignments = await Assignment.find({ classId });

//     res.status(httpStatus.OK).json(assignments);
//   },
// );

// get assignment list for students for their class.
const getAssignmentsByClass = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const { userId, role: userRole } = (req as any).user;

  const assignments = await Assignment.find({ classId });

  const enriched = await Promise.all(
    assignments.map(async (assignment) => {
      let submission = null;

      if (userRole === "student") {
        submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: userId,
        }).select("submittedAt marks");
      }

      return {
        ...assignment.toObject(),
        mySubmission: submission || null,
      };
    }),
  );

  res.status(httpStatus.OK).json(enriched);
});

// Get assignment by ID
const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assignment = await Assignment.findById(id).populate(
    "createdBy",
    "name",
  );

  if (!assignment) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Assignment not found" });
    return;
  }

  res.status(httpStatus.OK).json(assignment);
});

export const AssignmentController = {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
};
