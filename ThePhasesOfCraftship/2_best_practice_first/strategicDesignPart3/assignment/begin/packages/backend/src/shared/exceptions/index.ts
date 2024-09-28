import { ErrorExceptionType, REASON_PHASE, STATUS_CODE } from "../constants";

class HttpException extends Error {
  public type: string;
  constructor(
    type: string = 'Custom HttpException',
    message: string,
  ) {
    super(message);
    this.type = type;
  }
}

class InvalidRequestBodyException extends HttpException {
  constructor(missingKeys: string[]) {
    const message = "Body is missing required key: " + missingKeys.join(", ");
    super(ErrorExceptionType.InvalidRequestBody, message);
  }
}

class UserEmailAlreadyExistException extends HttpException {
  constructor() {
    super(ErrorExceptionType.UserEmailAlreadyExist, "User email already exist");
  }
}

class UsernameAlreadyExistException extends HttpException {
  constructor() {
    super(ErrorExceptionType.UsernameAlreadyTaken, "Username already exist");
  }
}

class UserNotFoundException extends HttpException {
  constructor() {
    super(ErrorExceptionType.UserNotFound, "User not found");
  }
}

class ServerErrorException extends HttpException {
  constructor() {
    super(ErrorExceptionType.ServerError, "An error occurred while processing your request");
  }
}

export {
  InvalidRequestBodyException,
  UserEmailAlreadyExistException,
  UsernameAlreadyExistException,
  UserNotFoundException,
  ServerErrorException,
  HttpException,
};
