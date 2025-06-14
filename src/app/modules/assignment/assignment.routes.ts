import express from "express";
import { AssignmentController } from "./assignment.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/createAssignment",
  auth(ENUM_USER_ROLE.TEACHER),
  AssignmentController.createAssignment,
);
router.get("/class/:classId", AssignmentController.getAssignmentsByClass);
router.get("/:id", AssignmentController.getAssignmentById);

export const AssignmentRoutes = router;
