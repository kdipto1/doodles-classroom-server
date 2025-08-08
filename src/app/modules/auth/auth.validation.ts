import { z } from "zod";
import { ENUM_USER_ROLE } from "../../../enums/user";
import {
  VALIDATION_LIMITS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
} from "../../../constants/common";

const register = z.object({
  body: z.object({
    name: z
      .string()
      .min(VALIDATION_LIMITS.NAME_MIN_LENGTH, {
        message: ERROR_MESSAGES.NAME_REQUIRED,
      })
      .max(VALIDATION_LIMITS.NAME_MAX_LENGTH, {
        message: ERROR_MESSAGES.NAME_TOO_LONG,
      })
      .regex(REGEX_PATTERNS.NAME_PATTERN, {
        message: ERROR_MESSAGES.NAME_INVALID_FORMAT,
      }),
    email: z
      .string()
      .email({ message: ERROR_MESSAGES.EMAIL_INVALID })
      .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, {
        message: ERROR_MESSAGES.EMAIL_TOO_LONG,
      }),
    password: z
      .string()
      .min(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
        message: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
      })
      .max(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH, {
        message: ERROR_MESSAGES.PASSWORD_TOO_LONG,
      })
      .regex(REGEX_PATTERNS.PASSWORD_PATTERN, {
        message: ERROR_MESSAGES.PASSWORD_WEAK,
      }),
    role: z.enum([ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.TEACHER]),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID }),
    password: z.string().min(1, { message: ERROR_MESSAGES.PASSWORD_REQUIRED }),
  }),
});

export const AuthValidation = {
  register,
  login,
};
