import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions";

export type ErrorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;
