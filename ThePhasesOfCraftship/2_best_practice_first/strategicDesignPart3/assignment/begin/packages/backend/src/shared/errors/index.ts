import { Request, Response, NextFunction } from "express";
import {
  InvalidRequestBodyException,
  UserEmailAlreadyExistException,
  UsernameAlreadyExistException,
} from "../exceptions";
import { ErrorExceptionType } from "../constants";

export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;

export class ErrorExceptionHandler {
  public handle(error: Error, req: Request, res: Response, next: NextFunction): Response {
    if (error instanceof InvalidRequestBodyException) {
      console.log(error.statusCode)
      return res.status(error.statusCode).json({
        error: ErrorExceptionType.ValidationError,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof UserEmailAlreadyExistException) {
      return res.status(error.statusCode).json({
        error: ErrorExceptionType.UserEmailAlreadyExist,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof UsernameAlreadyExistException) {
      return res.status(error.statusCode).json({
        error: ErrorExceptionType.UsernameAlreadyTaken,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      error: ErrorExceptionType.ServerError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }
}
