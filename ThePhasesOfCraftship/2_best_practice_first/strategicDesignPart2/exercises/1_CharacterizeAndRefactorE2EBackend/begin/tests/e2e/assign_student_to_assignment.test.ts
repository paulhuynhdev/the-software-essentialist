import { StudentEnrollmentBuilder } from "./../fixtures/studentEnrollmentBuilder";
import { test, beforeAll } from "@jest/globals";
import { resetDatabase } from "../fixtures/reset";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { ClassRoomBuilder } from "../fixtures/classRoomBuilder";
import { StudentBuilder } from "../fixtures/studentBuilder";
import { AssignmentBuilder } from "../fixtures/assignmentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../features/createClassRoom.feature")
);

defineFeature(feature, (test) => {
  test("Assign a student to an assignment", ({ given, when, and, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: any;
    let assignment: any;

    let studentEnrollmentBuilder: StudentEnrollmentBuilder =
      new StudentEnrollmentBuilder();
    let classroomBuilder: ClassRoomBuilder = new ClassRoomBuilder();
    let studentBuilder: StudentBuilder = new StudentBuilder();
    let assignmentBuilder: AssignmentBuilder = new AssignmentBuilder();

    beforeAll(async () => {
      await resetDatabase();
    });

    given("there is an existing student enrolled to a class", async () => {
      const enrollmentResult = await studentEnrollmentBuilder
        .andClassroom(classroomBuilder.withName("Math"))
        .andStudent(studentBuilder.withName("Johnny").withRandomEmail())
        .build();
      student = enrollmentResult.student;
    });

    and("an assignment exists for the class", async () => {
      assignment = await assignmentBuilder
        .andClassroom(classroomBuilder.withName("Math"))
        .build();
    });
  });
});
