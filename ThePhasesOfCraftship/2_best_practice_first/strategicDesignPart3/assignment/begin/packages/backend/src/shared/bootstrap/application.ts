import express, { Application as ExpressApp } from "express";
import { UserController } from "../../modules/users/userController";
import { enableGracefulShutdown } from "../server";

export class Application {
  private readonly _instance: ExpressApp;

  constructor(private userController: UserController) {
    this._instance = express();
    this.addMiddleWares();
    this.registerRoutes();
  }

  private addMiddleWares() {
    this._instance.use(express.json());
  }

  private registerRoutes() {
    this._instance.use("/users", this.userController.getRouter());
  }

  public start(port: number) {
    const server = this._instance.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    enableGracefulShutdown(server);
  }
}
