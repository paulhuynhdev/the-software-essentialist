import { Request, Response, NextFunction } from "express";
import { CreateUserCommand } from "./userCommand";
import { UserService } from "./userService";
import express from "express";
import { ErrorExceptionHandler, ErrorHandler } from "../../shared/errors";
import { parseUserForResponse } from "../../shared/utils/parseUserForResponse";

export class UserController {
  private router: express.Router;

  constructor(private userService: UserService, private errorHandler: ErrorExceptionHandler) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  setupRoutes() {
    this.router.post("/new", this.createUser.bind(this));
  }

  private async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userDTO = CreateUserCommand.fromRequest(req.body);
      const data = await this.userService.createUser(userDTO);
      res.status(201).json({
        error: undefined,
        data: parseUserForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
