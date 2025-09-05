import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z
      .string({
        error: "Email is required",
      })
      .email(),
    password: z
      .string({
        error: "Password is required",
      })
      .max(72, "Password cannot be longer than 72 characters"),
    role: z.string({
      error: "Role is required",
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
