import express from "express";
import { ClassroomController } from "./classroom.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/createClass",
  auth(ENUM_USER_ROLE.TEACHER),
  ClassroomController.createClass,
);
router.post(
  "/join",
  auth(ENUM_USER_ROLE.STUDENT),
  ClassroomController.joinClass,
);
router.get(
  "/my",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  ClassroomController.getMyClasses,
);
router.get("/:id", ClassroomController.getClassById);

export const ClassesRoutes = router;
