import { isMissingKeys } from "../helpers/isMissingKey";
import { InvalidRequestBodyException } from "../shared/exceptions";

export class GradeAssignmentDTO {
  constructor(public studentId: string, public assignmentId: string, public grade: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "assignmentId", "grade"];
    const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, assignmentId, grade } = body as {
      studentId: string;
      assignmentId: string;
      grade: string;
    };

    return new GradeAssignmentDTO(studentId, assignmentId, grade);
  }
}
