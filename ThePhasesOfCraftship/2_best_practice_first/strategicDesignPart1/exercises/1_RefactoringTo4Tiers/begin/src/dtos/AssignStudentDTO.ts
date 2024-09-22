import { isMissingKeys } from "../helpers/isMissingKey";
import { InvalidRequestBodyException } from "../shared/exceptions";

export class AssignStudentDTO {
  constructor(public studentId: string, public assignmentId: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "assignmentId"];
    const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, assignmentId } = body as {
      studentId: string;
      assignmentId: string;
    };

    return new AssignStudentDTO(studentId, assignmentId);
  }
}
