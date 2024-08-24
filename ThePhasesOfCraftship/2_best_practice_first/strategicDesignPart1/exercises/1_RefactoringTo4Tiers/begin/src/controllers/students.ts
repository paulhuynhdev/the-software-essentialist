import express, { NextFunction, Request, Response } from "express";
import { CreateStudentDTO } from "../dtos/CreateStudentDTO";
import { parseForResponse } from "../helpers/parseForResponse";
import { isUUID } from "../helpers/isUUID";
import StudentService from "../services/students";
import { ErrorHandler } from "../shared/errorHandler";
import { ErrorExceptionType } from "../shared/constants";

export class StudentsController {
  private router: express.Router;

  constructor(private studentService: StudentService, private errorHandler: ErrorHandler) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupRoutes() {
    this.router.post("/", this.createStudent);
    this.router.get("/", this.getAllStudents);
    this.router.get("/:id", this.getStudentById);
    this.router.get("/:id/grades", this.getStudentGrades);
    this.router.get("/:id/assignments", this.getStudentAssignments);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  getRouter() {
    return this.router;
  }

  private createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateStudentDTO.fromRequest(req.body);

      const data = await this.studentService.createStudent(dto);

      res.status(201).json({ error: undefined, data: parseForResponse(data), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getAllStudents = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const students = await this.studentService.getAllStudents();
      res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res
          .status(400)
          .json({ error: ErrorExceptionType.ValidationError, data: undefined, success: false });
      }
      const student = await this.studentService.getStudentById(id);
      if (!student) {
        return res
          .status(404)
          .json({ error: ErrorExceptionType.StudentNotFound, data: undefined, success: false });
      }

      res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getStudentGrades = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res
          .status(400)
          .json({ error: ErrorExceptionType.ValidationError, data: undefined, success: false });
      }
      const data = await this.studentService.getStudentGrades(id);

      res.status(200).json({ error: undefined, data: parseForResponse(data), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getStudentAssignments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res
          .status(400)
          .json({ error: ErrorExceptionType.ValidationError, data: undefined, success: false });
      }
      const data = await this.studentService.getAssignments(id);

      res.status(200).json({ error: undefined, data: parseForResponse(data), success: true });
    } catch (error) {
      next(error);
    }
  };
}
