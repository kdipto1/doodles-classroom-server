import { z } from "zod";
import { ENUM_USER_ROLE } from "../../../enums/user";

const register = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(72, { message: "Password cannot be longer than 72 characters" }),
    role: z.enum([ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.TEACHER]),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "A valid email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});

export const AuthValidation = {
  register,
  login,
};
