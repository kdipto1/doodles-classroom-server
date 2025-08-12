import { UserPayload } from "../../../interfaces/user.payload";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { Assignment } from "../assignment/assignment.model";
import { Submission } from "../submission/submission.model";
import { Classroom } from "../classroom/classroom.model";
import { ENUM_USER_ROLE } from "../../../enums/user";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const user = (req as Request & { user: UserPayload }).user;

  const stats = {
    classes: 0,
    assignments: 0,
    upcoming: 0,
  };

  if (user.role === ENUM_USER_ROLE.TEACHER) {
    stats.classes = await Classroom.countDocuments({ teacher: user.userId });
    stats.assignments = await Assignment.countDocuments({
      createdBy: user.userId,
    });

    stats.upcoming = await Assignment.countDocuments({
      createdBy: user.userId,
      dueDate: { $gte: new Date() },
    });
  } else if (user.role === ENUM_USER_ROLE.STUDENT) {
    // Classes joined
    stats.classes = await Classroom.countDocuments({ students: user.userId });

    // Fetch class IDs the student is in
    const classes = await Classroom.find({ students: user.userId }).select(
      "_id",
    );
    const classIds = classes.map((cls) => cls._id);

    // Total assignments
    stats.assignments = await Assignment.countDocuments({
      classId: { $in: classIds },
    });

    // Assignments the student has already submitted
    const submittedAssignmentIds = await Submission.find({
      student: user.userId,
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
