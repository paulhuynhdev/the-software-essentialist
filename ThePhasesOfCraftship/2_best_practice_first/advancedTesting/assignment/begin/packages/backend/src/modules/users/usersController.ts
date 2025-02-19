import express from "express";
// import { UsersService } from "./usersService";
import { CreateUserCommand } from "./usersCommand";
import {
  CreateUserResponse,
  GetUserByEmailResponse,
} from "@dddforum/shared/src/api/users";
// import { ErrorHandler } from "../../shared/errors";
import { Application } from "../../shared/http/interfaces";
import { userErrorHandler } from "./usersErrors";

export class UsersController {
  private router: express.Router;

  constructor(
    // private usersService: UsersService,
    // private errorHandler: ErrorHandler,
    private application: Application,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/new", this.createUser.bind(this));
    this.router.get("/:email", this.getUserByEmail.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(userErrorHandler);
  }

  private async createUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const command = CreateUserCommand.fromRequest(req.body);
      const user = await this.application.user.createUser(command);
      const response: CreateUserResponse = {
        success: true,
        data: user,
        error: {},
      };
      return res.status(201).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  private async getUserByEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const email = req.params.email;
      const user = await this.application.user.getUserByEmail(email);
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
