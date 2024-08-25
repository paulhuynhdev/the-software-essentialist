import { afterAll, afterEach, expect, beforeAll } from "@jest/globals";
import { resetDatabase } from "../fixtures/reset";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { Factory } from "../fixtures/factory";
import { faker } from "@faker-js/faker";
import { WebServer } from "../../shared/http/webServer";
import { RESTfulAPIDriver } from "../../shared/http/resfulAPIDriver";
import { Server } from "http";

const feature = loadFeature(
  path.join(__dirname, "../features/assignStudentToAssignment.feature")
);

defineFeature(feature, (test) => {
  let webServer: WebServer = new WebServer();
  let driver: RESTfulAPIDriver;
  test("Assign a student to an assignment", ({ given, when, and, then }) => {
    beforeAll(async () => {
      await webServer.start();
      driver = new RESTfulAPIDriver(webServer.getHttp() as Server);

      await resetDatabase();
    });

    afterAll(async () => {
      await webServer.stop();
    });

    let requestBody: any = {};
    let response: any = {};
    let student: any;
    let assignment: any;

    const f = new Factory();

    const uniqueName = faker.lorem.word() + faker.string.uuid();
    given("there is an existing student enrolled to a class", async () => {
      const enrollmentResult = await f
        .anEnrolledStudent()
        .from(f.aClassRoom().withClassName("Math"))
        .and(f.aStudent().withName(uniqueName).withRandomEmail())
        .build();

      student = enrollmentResult.student;
    });

    and("an assignment exists for the class", async () => {
      assignment = await f
        .anAssignment()
        .from(f.aClassRoom().withClassName("English"))
        .build();
    });

    when("I assign the student the assignment", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
      };

      response = await driver.post("/student-assignments", requestBody);
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
