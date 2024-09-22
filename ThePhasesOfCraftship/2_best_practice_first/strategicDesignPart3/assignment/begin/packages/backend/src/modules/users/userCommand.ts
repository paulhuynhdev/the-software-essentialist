import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { isMissingKeys } from "@dddforum/backend/src/shared/utils/isMissingKeys";
import { InvalidRequestBodyException } from "@dddforum/backend/src/shared/exceptions";

export class CreateUserCommand {
  constructor(public props: CreateUserParams) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["email", "firstName", "lastName", "username"];
    const isRequestInvalid = !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { username, email, firstName, lastName } = body as CreateUserParams;

    return new CreateUserCommand({ firstName, lastName, email, username });
  }

  get email() {
    return this.props.email;
  }

  get username() {
    return this.props.username;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }
}
