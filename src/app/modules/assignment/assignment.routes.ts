import express from "express";
import { AssignmentController } from "./assignment.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AssignmentValidation } from "./assignment.validation";

const router = express.Router();

router.post(
  "/createAssignment",
  auth(ENUM_USER_ROLE.TEACHER),
  validateRequest(AssignmentValidation.createAssignmentZodSchema),
  AssignmentController.createAssignment,
);
router.get(
  "/class/:classId",
  auth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.TEACHER),
  AssignmentController.getAssignmentsByClass,
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  AssignmentController.getAssignmentById,
);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.TEACHER),
  validateRequest(AssignmentValidation.editAssignmentZodSchema),
  AssignmentController.editAssignment,
);

export const AssignmentRoutes = router;
