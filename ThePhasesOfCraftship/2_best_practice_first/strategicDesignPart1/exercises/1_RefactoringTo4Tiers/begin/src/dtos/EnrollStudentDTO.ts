import { isMissingKeys } from "../helpers/isMissingKey";
import { InvalidRequestBodyException } from "../shared/exceptions";

export class EnrollStudentDTO {
  constructor(public studentId: string, public classId: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "classId"];
    const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, classId } = body as { studentId: string; classId: string };

    return new EnrollStudentDTO(studentId, classId);
  }
}
