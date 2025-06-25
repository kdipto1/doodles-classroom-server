import express from "express";
import { SubmissionController } from "./submission.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/submitAssignment",
  auth(ENUM_USER_ROLE.STUDENT),
  SubmissionController.submitAssignment,
);
router.get(
  "/assignment/:assignmentId",
  auth(ENUM_USER_ROLE.TEACHER),
  SubmissionController.getSubmissionsByAssignment,
);
router.get(
  "/my/:assignmentId",
  auth(ENUM_USER_ROLE.STUDENT),
  SubmissionController.getMySubmission,
);
router.patch(
  "/:id/grade",
  auth(ENUM_USER_ROLE.TEACHER),
  SubmissionController.gradeSubmission,
);

export const SubmissionRoutes = router;
