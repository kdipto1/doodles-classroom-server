import express from "express";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  DashboardController.getDashboardStats,
);

export const DashboardRoutes = router;
