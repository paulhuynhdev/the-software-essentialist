import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import { Assignment } from "./types";
import { ClassRoomBuilder } from "./classRoomBuilder";

class AssignmentBuilder {
  private assignment: Assignment;
  private classRoomBuilder: ClassRoomBuilder;

  constructor() {
    this.classRoomBuilder = new ClassRoomBuilder();
    this.assignment = {
      id: "",
      classId: "",
      title: "",
    };
  }

  andClassroom(classRoomBuilder: ClassRoomBuilder) {
    this.classRoomBuilder = classRoomBuilder;
    return this;
  }

  async build() {
    const cls = await this.classRoomBuilder.build();
    this.assignment = await prisma.assignment.create({
      data: {
        title: faker.lorem.word(),
        classId: cls.id,
      },
    });

    return this.assignment;
  }

  getAssignment() {
    return this.assignment;
  }
}

export { AssignmentBuilder };
