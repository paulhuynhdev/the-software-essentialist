import { Request, Response, NextFunction } from "express";
import { CreateUserCommand } from "./userCommand";
import { UserService } from "./userService";
import express from "express";
import { ErrorHandler } from "../../shared/errors";
import { parseUserForResponse } from "../../shared/utils/parseUserForResponse";
import { GetUserByEmailResponse } from "@dddforum/shared/src/api/users";

export class UserController {
  private router: express.Router;

  constructor(private userService: UserService, private errorHandler: ErrorHandler) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  setupRoutes() {
    this.router.post("/new", this.createUser.bind(this));
    this.router.get("/:email", this.getUserByEmail.bind(this));
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

  private async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const email = req.params.email;
      const user = await this.userService.getUserByEmail(email);
      const response: GetUserByEmailResponse = {
        success: true,
        data: user,
        error: {},
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
