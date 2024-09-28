import express from "express";
import cors from "cors";
import {
  createClassController,
  enrollClassController,
  getAllClassAssignmentController,
} from "../../src/controllers/classController";
import {
  assignStudentController,
  createAssignmentController,
  getAssignmentByIdController,
  gradeAssignmentController,
  submitAssignmentController,
} from "../../src/controllers/assignmentController";
import {
  createStudentController,
  getAllStudentController,
  getAllStudentGradeController,
  getAllSubmittedAssignmentController,
  getStudentByIdController,
} from "../../src/controllers/studentController";
import { Server } from "http";
import { ProcessService } from "../processes/processService";

export class WebServer {
  private express: express.Express;
  private http: Server | undefined;
  private state: "Started" | "Stopped";

  constructor() {
    this.express = this.createExpress();
    this.configureExpress();
    this.setupRoutes();
    this.state = "Stopped";
  }

  private setupRoutes() {
    this.express.post("/students", createStudentController);
    // POST class created
    this.express.post("/classes", createClassController);
    // POST student assigned to class
    this.express.post("/class-enrollments", enrollClassController);
    // POST assignment created
    this.express.post("/assignments", createAssignmentController);
    // POST student assigned to assignment
    this.express.post("/student-assignments", assignStudentController);
    // POST student submitted assignment
    this.express.post(
      "/student-assignments/submit",
      submitAssignmentController
    );
    // POST student assignment graded
    this.express.post("/student-assignments/grade", gradeAssignmentController);
    // GET all students
    this.express.get("/students", getAllStudentController);
    // GET a student by id
    this.express.get("/students/:id", getStudentByIdController);
    // GET assignment by id
    this.express.get("/assignments/:id", getAssignmentByIdController);
    // GET all assignments for class
    this.express.get(
      "/classes/:id/assignments",
      getAllClassAssignmentController
    );
    // GET all student submitted assignments
    this.express.get(
      "/student/:id/assignments",
      getAllSubmittedAssignmentController
    );
    // GET all student grades
    this.express.get("/student/:id/grades", getAllStudentGradeController);
  }

  private configureExpress() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private createExpress(): any {
    return express();
  }

  public async start(port: number): Promise<void> {
    // Kill the process running on the port if exist
    // const port = 3000;

    return new Promise(async (resolve, reject) => {
      await ProcessService.killProcessOnPort(Number(port), () => {
        this.http = this.express.listen(port, () => {
          console.log(`Server is running on port ${port}`);
          this.state = "Started";
          resolve();
        });
      });
    });
  }

  public isRunning() {
    return this.state !== "Started";
  }

  public async stop(): Promise<void> {
    if (!this.isRunning()) return;

    return new Promise((resolve, reject) => {
      this.http?.close(() => {
        this.state = "Stopped";
        resolve();
      });
    });
  }

  public getHttp() {
    if (!this.isRunning) throw new Error("Not yet started");
    return this.http;
  }
}
