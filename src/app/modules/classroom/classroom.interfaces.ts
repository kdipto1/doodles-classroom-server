import { Model, Types } from "mongoose";

export interface IClassroom {
  title: string;
  subject?: string | null;
  description?: string | null;
  code: string;
  teacher: Types.ObjectId;
  students: Types.ObjectId[];
}

export type ClassroomModel = Model<IClassroom, Record<string, unknown>>;
