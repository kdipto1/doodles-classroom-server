import express from "express";
import { ClassroomController } from "./classroom.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middleware/validateRequest";
import { ClassroomValidation } from "./classroom.validation";

const router = express.Router();

router.post(
  "/createClass",
  auth(ENUM_USER_ROLE.TEACHER),
  validateRequest(ClassroomValidation.createClass),
  ClassroomController.createClass,
);
router.post(
  "/join",
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(ClassroomValidation.joinClass),
  ClassroomController.joinClass,
);
router.get(
  "/my",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  ClassroomController.getMyClasses,
);
// router.get("/:id", ClassroomController.getClassById);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  ClassroomController.getClassById,
);

export const ClassesRoutes = router;
