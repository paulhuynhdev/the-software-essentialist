import { prisma } from "../../src/database";
import { Class } from "@prisma/client";
import { AssignmentBuilder } from "./assignmentBuilder";

export class ClassRoomBuilder {
  private classRoom: Partial<Class>;
  private assignmentsBuilders: AssignmentBuilder[];

  constructor() {
    this.classRoom = {};
    this.assignmentsBuilders = [];
  }

  withClassName(name: string) {
    this.classRoom.name = name;
    return this;
  }

  withAssignment(assignmentBuilder: AssignmentBuilder) {
    this.assignmentsBuilders.push(assignmentBuilder);
    return this;
  }

  async build() {
    let classroom = await prisma.class.create({
      data: {
        name: this.classRoom.name as string,
      },
    });

    return classroom;
  }
}
