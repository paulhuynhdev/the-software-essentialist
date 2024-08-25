import { AssignmentBuilder } from "./assignmentBuilder";
import { ClassRoomBuilder } from "./classRoomBuilder";
import { StudentBuilder } from "./studentBuilder";
import { StudentEnrollmentBuilder } from "./studentEnrollmentBuilder";

export class Factory {
  constructor() {}

  aStudent() {
    return new StudentBuilder();
  }

  aClassRoom() {
    return new ClassRoomBuilder();
  }

  anAssignment() {
    return new AssignmentBuilder();
  }

  anEnrolledStudent() {
    return new StudentEnrollmentBuilder();
  }
}
