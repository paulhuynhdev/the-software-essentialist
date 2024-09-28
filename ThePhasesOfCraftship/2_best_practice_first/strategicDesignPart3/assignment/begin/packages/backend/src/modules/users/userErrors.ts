import { Request, Response, NextFunction } from "express";
import { UserResponse } from "@dddforum/shared/src/api/users";
import { HttpException } from "../../shared/exceptions";
import { ErrorExceptionType } from "../../shared/constants";

export function userErrorHandler(
    error: HttpException,
    _: Request,
    res: Response,
    _next: NextFunction,
): Response<UserResponse> {
    let responseBody: UserResponse;
    if (error.type === ErrorExceptionType.InvalidRequestBody) {
        responseBody = {
            success: false,
            data: null,
            error: {
                message: error.message,
                code: "ValidationError",
            },
        };
        return res.status(400).json(responseBody);
    }

    if (error.type === ErrorExceptionType.UsernameAlreadyTaken) {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: "UsernameAlreadyTaken",
            },
        };
        return res.status(400).json(responseBody);
    }

    if (error.type === ErrorExceptionType.UserEmailAlreadyExist) {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: "EmailAlreadyInUse",
            },
        };
        return res.status(400).json(responseBody);
    }

    if (error.type === ErrorExceptionType.UserNotFound) {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: "UserNotFound",
            },
        };
        return res.status(404).json(responseBody);
    }

    responseBody = {
        success: false,
        data: null,
        error: {
            code: "ServerError",
        },
    };

    return res.status(500).json(responseBody);
}
