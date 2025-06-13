import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionText: { type: String },
    submissionFile: { type: String },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
