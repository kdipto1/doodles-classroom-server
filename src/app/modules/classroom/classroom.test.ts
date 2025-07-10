import request from "supertest";
import app from "../../../app";
import { Classroom } from "./classroom.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import config from "../../../config/config";

describe("Classroom Routes", () => {
  let teacherToken: string;
  let studentToken: string;
  let teacherId: string;
  let studentId: string;
  let classId: string;

  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url, { serverSelectionTimeoutMS: 20000 });
    // Create a teacher and a student for testing
    const teacher = await User.create({
      name: "Test Teacher",
      email: "teacher@test.com",
      password: "password123",
      role: "teacher",
    });
    teacherId = teacher._id as string;

    const student = await User.create({
      name: "Test Student",
      email: "student@test.com",
      password: "password123",
      role: "student",
    });
    studentId = student._id as string;

    // Log in as the teacher to get a token
    const teacherLoginRes = await request(app).post("/api/v1/auth/login").send({
      email: "teacher@test.com",
      password: "password123",
    });
    teacherToken = teacherLoginRes.body.data.accessToken;

    // Log in as the student to get a token
    const studentLoginRes = await request(app).post("/api/v1/auth/login").send({
      email: "student@test.com",
      password: "password123",
    });
    studentToken = studentLoginRes.body.data.accessToken;
  }, 15000);

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await mongoose.connection.close();
  }, 15000);

  describe("POST /api/v1/classes/createClass", () => {
    it("should create a new class", async () => {
      const res = await request(app)
        .post("/api/v1/classes/createClass")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          title: "Test Class",
          subject: "Test Subject",
          description: "Test Description",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("title", "Test Class");
      classId = res.body._id;
    });
  });

  describe("POST /api/v1/classes/join", () => {
    it("should allow a student to join a class", async () => {
      const classroom = await Classroom.findById(classId);
      const res = await request(app)
        .post("/api/v1/classes/join")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ code: classroom?.code });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Joined class successfully");
    });
  });
});
