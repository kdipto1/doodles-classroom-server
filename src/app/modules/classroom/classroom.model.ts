import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Classroom = mongoose.model("Classroom", classroomSchema);
