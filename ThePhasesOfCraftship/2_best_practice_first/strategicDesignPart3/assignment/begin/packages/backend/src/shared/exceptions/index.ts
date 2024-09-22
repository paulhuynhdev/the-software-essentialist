import { Response } from "express";
import { REASON_PHASE, STATUS_CODE } from "../constants";

class HttpException extends Error {
  statusCode: number;
  isOperational: boolean;
  data: null;
  constructor(
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    message = REASON_PHASE.INTERNAL_SERVER_ERROR,
    data = null,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      status: 0,
      message: this.message,
      data: this.data,
    });
  }
}

class InvalidRequestBodyException extends HttpException {
  constructor(missingKeys: string[]) {
    const message = "Body is missing required key: " + missingKeys.join(", ");
    super(STATUS_CODE.BAD_REQUEST, message);
  }
}

class UserEmailAlreadyExistException extends HttpException {
  constructor() {
    super(STATUS_CODE.BAD_REQUEST, "User email already exist");
  }
}

class UsernameAlreadyExistException extends HttpException {
  constructor() {
    super(STATUS_CODE.BAD_REQUEST, "Username already exist");
  }
}

export {
  InvalidRequestBodyException,
  UserEmailAlreadyExistException,
  UsernameAlreadyExistException,
};
