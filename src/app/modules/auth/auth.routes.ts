import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.register),
  AuthController.register,
);
router.post(
  "/login",
  validateRequest(AuthValidation.login),
  AuthController.login,
);
router.post(
  "/me",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
