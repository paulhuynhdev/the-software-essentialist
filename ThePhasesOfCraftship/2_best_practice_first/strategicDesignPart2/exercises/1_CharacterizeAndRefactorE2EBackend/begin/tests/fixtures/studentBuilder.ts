import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import { ClassRoomBuilder } from "./classRoomBuilder";
import { Student } from "@prisma/client";

export class StudentBuilder {
  private student: Partial<Student>;
    classRoomBuilder: ClassRoomBuilder;

  constructor() {
    this.classRoomBuilder = new ClassRoomBuilder();
    this.student = {};
  }

  withName(name: string) {
    this.student.name = name;
    return this;
  }

  withRandomEmail() {
    this.student.email = faker.internet.email();
    return this;
  }

  async build() {
    let student = await prisma.student.create({
      data: {
        name: this.student.name as string,
        email: this.student.email as string,
      },
    });

    return student;
  }
}
