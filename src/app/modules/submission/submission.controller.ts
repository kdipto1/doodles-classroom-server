import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Submission } from "./submission.model";

// Submit assignment (Student only)
const submitAssignment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { assignmentId, submissionText } = req.body;

    // @ts-ignore
    const user = (req as any).user;

    if (user.role !== "student") {
      res.status(httpStatus.FORBIDDEN).json({
        message: "Only students can submit assignments",
      });
      return;
    }

    const existing = await Submission.findOne({
      assignmentId,
      studentId: user.userId,
    });

    if (existing) {
      res.status(httpStatus.BAD_REQUEST).json({
        message: "Already submitted",
      });
      return;
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: user.userId,
      submissionText,
    });

    res.status(httpStatus.CREATED).json(submission);
  },
);

// Get all submissions for an assignment (Teacher only)
const getSubmissionsByAssignment = catchAsync(
  async (req: Request, res: Response) => {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignmentId }).populate(
      "studentId",
      "name email",
    );

    res.status(httpStatus.OK).json(submissions);
  },
);

// Get my submission (Student)
const getMySubmission = catchAsync(async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  // @ts-ignore
  const user = (req as any).user;

  const submission = await Submission.findOne({
    assignmentId,
    studentId: user.userId,
  });

  res.status(httpStatus.OK).json(submission);
});

// Grade a submission (Teacher only)
const gradeSubmission = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { grade, feedback } = req.body;
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      res.status(httpStatus.NOT_FOUND).json({
        message: "Submission not found",
      });
      return;
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    res.status(httpStatus.OK).json({
      message: "Graded successfully",
      submission,
    });
  },
);

export const SubmissionController = {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmission,
  gradeSubmission,
};
