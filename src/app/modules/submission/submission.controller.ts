import { UserPayload } from "../../../interfaces/user.payload";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Submission } from "./submission.model";
import { ENUM_USER_ROLE } from "../../../enums/user";

// Submit assignment (Student only)
const submitAssignment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { assignmentId, submissionText } = req.body;

    const user = (req as Request & { user: UserPayload }).user;

    if (user.role !== ENUM_USER_ROLE.STUDENT) {
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

  const user = (req as Request & { user: UserPayload }).user;

  const submission = await Submission.findOne({
    assignmentId,
    studentId: user.userId,
  });

  res.status(httpStatus.OK).json(submission);
});

// Grade a submission (Teacher only)
const gradeSubmission = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { marks, feedback } = req.body;
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      res.status(httpStatus.NOT_FOUND).json({
        message: "Submission not found",
      });
      return;
    }

    submission.marks = parseInt(marks);
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
