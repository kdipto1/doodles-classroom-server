import { z } from "zod";

const createClass = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().optional(),
    description: z.string().optional(),
  }),
});

const joinClass = z.object({
  body: z.object({
    code: z.string().min(1, "Class code is required"),
  }),
});

export const ClassroomValidation = {
  createClass,
  joinClass,
};
