import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Assignment } from "../assignment/assignment.model";
import { Submission } from "../submission/submission.model";
import { Classroom } from "../classroom/classroom.model";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const user = (req as any).user;

  const stats = {
    classes: 0,
    assignments: 0,
    upcoming: 0,
  };

  if (user.role === "teacher") {
    stats.classes = await Classroom.countDocuments({ teacher: user._id });
    stats.assignments = await Assignment.countDocuments({ teacher: user._id });

    stats.upcoming = await Assignment.countDocuments({
      teacher: user._id,
      dueDate: { $gte: new Date() },
    });
  } else if (user.role === "student") {
    // Classes joined
    stats.classes = await Classroom.countDocuments({ students: user._id });

    // Fetch class IDs the student is in
    const classes = await Classroom.find({ students: user._id }).select("_id");
    const classIds = classes.map((cls) => cls._id);

    // Total assignments
    stats.assignments = await Assignment.countDocuments({
      classId: { $in: classIds },
    });

    // Assignments the student has already submitted
    const submittedAssignmentIds = await Submission.find({
      student: user._id,
    }).distinct("assignmentId");

    // Upcoming assignments not submitted
    stats.upcoming = await Assignment.countDocuments({
      classId: { $in: classIds },
      dueDate: { $gte: new Date() },
      _id: { $nin: submittedAssignmentIds },
    });
  }

  res.status(httpStatus.OK).json(stats);
});

export const DashboardController = {
  getDashboardStats,
};
