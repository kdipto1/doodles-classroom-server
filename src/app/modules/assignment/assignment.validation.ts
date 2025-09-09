import { z } from "zod";

const createAssignmentZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    classId: z.string().min(1, "Class ID is required"),
  }),
});

const editAssignmentZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
  }),
});

export const AssignmentValidation = {
  createAssignmentZodSchema,
  editAssignmentZodSchema,
};
