import { prisma } from "../../src/database";
import { ClassRoomBuilder } from "./classRoomBuilder";
import { StudentBuilder } from "./studentBuilder";

export class StudentEnrollmentBuilder {
  private classRoomBuilder: ClassRoomBuilder;
  private studentBuilder: StudentBuilder;

  constructor() {
    this.classRoomBuilder = new ClassRoomBuilder();
    this.studentBuilder = new StudentBuilder();
  }

  from(classBuilder: ClassRoomBuilder) {
    this.classRoomBuilder = classBuilder;
    return this;
  }

  and(studentBuilder: StudentBuilder) {
    this.studentBuilder = studentBuilder;
    return this;
  }

  andClassroom(classRoomBuilder: ClassRoomBuilder) {
    this.classRoomBuilder = classRoomBuilder;
    return this;
  }

  andStudent(studentBuilder: StudentBuilder) {
    this.studentBuilder = this.studentBuilder;
    return this;
  }

  async build() {
    let classRoom = await this.classRoomBuilder.build();
    let student = await this.studentBuilder.build();

    await prisma.classEnrollment.create({
      data: {
        studentId: student.id,
        classId: classRoom.id,
      },
    });

    return { student, classRoom };
  }
}
