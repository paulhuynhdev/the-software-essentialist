import { prisma } from "../../src/database";
import { Class } from "@prisma/client";

export class ClassRoomBuilder {
  private classRoom: Partial<Class>;

  constructor() {
    this.classRoom = {};
  }

  withName(name: string) {
    this.classRoom.name = name;
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
