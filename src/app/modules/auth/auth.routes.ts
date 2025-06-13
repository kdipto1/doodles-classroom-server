import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post(
  "/me",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  AuthController.getMe,
);

export const AuthRoutes = router;
