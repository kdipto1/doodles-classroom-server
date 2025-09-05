import { z } from "zod";

const createClassroomZodSchema = z.object({
  body: z.object({
    title: z.string({
      error: "Classroom name is required",
    }),
    subject: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const ClassroomValidation = {
  createClassroomZodSchema,
};
