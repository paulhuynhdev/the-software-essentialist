import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../shared/errorHandler";
import ClassService from "../services/classes";
import { parseForResponse } from "../helpers/parseForResponse";
import { CreateClassDTO } from "../dtos/CreateClassDTO";
import { isUUID } from "../helpers/isUUID";
import { ErrorExceptionType } from "../shared/constants";
import { EnrollStudentDTO } from "../dtos/EnrollStudentDTO";

export class ClassesController {
  private router = express.Router();

  constructor(private classService: ClassService, private errorHandler: ErrorHandler) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post("/", this.createClass);
    this.router.get("/", this.getAllClasses);
    this.router.get("/:id", this.getClass);
    this.router.post("/enrollments", this.enrollStudent);
  }

  public getRouter() {
    return this.router;
  }

  private createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const dto = CreateClassDTO.fromRequest(req.body);
      const data = await this.classService.saveClass(dto);
      res.status(201).json({ error: undefined, data: parseForResponse(data), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cls = await this.classService.getAllClasses();
      res.status(200).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(400).json({
          error: ErrorExceptionType.ValidationError,
          data: undefined,
          success: false,
        });
      }
      const cls = await this.classService.getById(id);
      if (!cls) {
        return res.status(404).json({
          error: ErrorExceptionType.ClassNotFound,
          data: undefined,
          success: false,
        });
      }

      res.status(200).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      next(error);
    }
  };

  private enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = EnrollStudentDTO.fromRequest(req.body);

      const data = await this.classService.enrollStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
