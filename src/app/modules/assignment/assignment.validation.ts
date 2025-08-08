import { z } from "zod";

const createAssignment = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    classId: z.string().min(1, "Class ID is required"),
  }),
});

export const AssignmentValidation = {
  createAssignment,
};
