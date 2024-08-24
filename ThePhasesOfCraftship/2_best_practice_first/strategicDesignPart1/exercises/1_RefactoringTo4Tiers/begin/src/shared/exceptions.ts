import { Response } from "express";
import { REASON_PHASE, STATUS_CODE } from "./constants";

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

class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(", "));
  }
}

class StudentNotFoundException extends Error {
  constructor() {
    super("Student not found");
  }
}

class ClassNotFoundException extends Error {
  constructor(id: string) {
    super(`Class with id ${id} not found`);
  }
}

class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super("Student is already enrolled in class");
  }
}

class AssignmentNotFoundException extends Error {
  constructor() {
    super("Assignment not found");
  }
}

class InvalidParameterException extends HttpException {
  constructor(message: string) {
    super(STATUS_CODE.BAD_REQUEST, message);
  }
}

class StudentAssignmentNotFoundException extends Error {
  constructor() {
    super(
      "Student assignment not found. Please, make sure the student is assigned to the assignment."
    );
  }
}

export {
  InvalidParameterException,
  InvalidRequestBodyException,
  StudentNotFoundException,
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  AssignmentNotFoundException,
  StudentAssignmentNotFoundException,
};
