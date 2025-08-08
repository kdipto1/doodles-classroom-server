import { z } from "zod";

const submitAssignment = z.object({
  body: z.object({
    assignmentId: z.string().min(1, "Assignment ID is required"),
    submissionText: z.string().optional(),
    submissionFile: z.string().optional(),
  }),
});

const gradeSubmission = z.object({
  body: z.object({
    marks: z.number().min(0, "Marks must be a positive number"),
    feedback: z.string().optional(),
  }),
});

export const SubmissionValidation = {
  submitAssignment,
  gradeSubmission,
};
