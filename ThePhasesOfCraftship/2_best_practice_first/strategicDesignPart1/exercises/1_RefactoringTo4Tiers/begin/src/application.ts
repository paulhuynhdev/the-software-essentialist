import express, { Application as ExpressApp } from "express";
import { StudentsController } from "./controllers/students";
import { enableGracefulShutdown } from "./shared/server";
import { ClassesController } from "./controllers/classes";
import { AssignmentController } from "./controllers/assignments";

export class Application {
  private readonly _instance: ExpressApp;

  constructor(
    private studentController: StudentsController,
    private classController: ClassesController,
    private assignmentController: AssignmentController
  ) {
    this._instance = express();
    this.addMiddleWares();
    this.registerRoutes();
  }

  private addMiddleWares() {
    this._instance.use(express.json());
  }

  private registerRoutes() {
    this._instance.use("/students", this.studentController.getRouter());
    this._instance.use("/classes", this.classController.getRouter());
    this._instance.use("/assignments", this.assignmentController.getRouter());
  }

  public start(port: number) {
    const server = this._instance.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    enableGracefulShutdown(server);
  }
}
