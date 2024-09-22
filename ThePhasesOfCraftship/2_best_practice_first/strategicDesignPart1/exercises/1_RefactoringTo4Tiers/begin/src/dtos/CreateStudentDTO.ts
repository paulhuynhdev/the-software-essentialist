import { isMissingKeys } from "../helpers/isMissingKey";
import { InvalidRequestBodyException } from "../shared/exceptions";

export class CreateStudentDTO {
  constructor(public name: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["name"];
    const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = body as { name: string };

    return new CreateStudentDTO(name);
  }
}
