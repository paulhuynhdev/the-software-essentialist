import { beforeAll, expect } from "@jest/globals";
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { Factory } from "../fixtures/factory";
import { app } from "../../src";

const feature = loadFeature(
  path.join(__dirname, "../features/createClassRoom.feature")
);

defineFeature(feature, (test) => {
  test("Assign a student to an assignment", ({ given, when, and, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: any;
    let assignment: any;

    const f = new Factory()

    beforeAll(async () => {
      await resetDatabase();
    });

    given("there is an existing student enrolled to a class", async () => {
      const enrollmentResult = await f.anEnrolledStudent()
        .from(f.aClassRoom().withClassName("Math"))
        .and(f.aStudent())
        .build();

      student = enrollmentResult.student;
    });

    and("an assignment exists for the class", async () => {
      assignment = await f.anAssignment()
        .from(f.aClassRoom().withClassName("Math"))
        .build();
    });

    when("I assign the student the assignment", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
      };

      response = await request(app)
        .post("/student-assignments")
        .send(requestBody);
    });

    then("the student should be assigned to the assignment", () => {
      expect(response.status).toBe(201);
      expect(response.body.data.studentId).toBeTruthy();
      expect(response.body.data.assignmentId).toBeTruthy();
      expect(response.body.data.grade).toBeDefined();
      expect(response.body.data.status).toBeDefined();

      expect(response.body.data.studentId).toBe(requestBody.studentId);
      expect(response.body.data.assignmentId).toBe(requestBody.assignmentId);
    });
  });
});
