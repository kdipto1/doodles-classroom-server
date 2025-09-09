import { Model, Types } from "mongoose";

export interface IAssignment {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  classId: Types.ObjectId;
  createdBy: Types.ObjectId;
}

export interface IAssignmentUpdate {
  title?: string;
  description?: string;
  dueDate?: Date;
}

export type AssignmentModel = Model<IAssignment, Record<string, unknown>>;
